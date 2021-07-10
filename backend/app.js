const path = require("path");
require("dotenv").config({
  path: path.resolve(process.cwd(), ".env"),
});

const express = require("express");
const app = express();
const http = require("http");
const { connectDb, client } = require("./db");
const server = http.createServer(app);

const io = require("socket.io")(server, {
  origin: "*",
  cors: true,
});
const signalServer = require("simple-signal-server")(io);
const rooms = {};
const socketRooms = {};

io.on("connection", (socket) => {
  socket.on("joinRoom", async (payload) => {
    const data = JSON.parse(payload);
    const { id } = data;
    socket.join(data.id);
    console.log(socketRooms);
    if (!socketRooms[id]) {
      socketRooms[id] = new Set();
    }
    socketRooms[id].add(data.user);
    io.in(id).emit("users", JSON.stringify(Array.from(socketRooms[id])));
    socket.on("disconnect", () => {
      io.in(id).emit("delete", data.user.streamId);
      socketRooms[id].delete(data.user);
      io.in(id).emit("users", JSON.stringify(Array.from(socketRooms[id])));
    });
    socket.on("promote", (promoteId) => {
      socketRooms[id] = new Set(
        Array.from(socketRooms[id]).map((mem) => {
          if (mem.streamId === promoteId) {
            return { ...mem, speaker: true };
          }
          return mem;
        })
      );

      io.in(id).emit("users", JSON.stringify(Array.from(socketRooms[id])));
      io.in(id).emit("lift", promoteId);
    });
    socket.on("speaking", (speakId) => {
      Array.from(socketRooms[id]).find(
        (s) => s.streamId === speakId && s.speaker
      ) && io.in(id).emit("spoke", speakId);
    });
    const collection = client.db(process.env.MONGO_DB).collection("rooms");

    async function* genUpdates(collection) {
      const changeStream = collection.watch();
      while (true) {
        const next = await changeStream.next();
        yield next;
      }
    }
    for await (const { operationType, updateDescription } of genUpdates(
      collection
    )) {
      operationType === "update" &&
        io.in(id).emit("update", updateDescription.updatedFields);
    }
  });
});

signalServer.on("discover", (request) => {
  console.log("in signal server")
  const roomID = request.discoveryData;
  signalServer.on("disconnect", (socket) => {
    const clientID = socket.id;
    rooms[roomID].delete(clientID);
  });
  if (!rooms[roomID]) {
    rooms[roomID] = new Set();
  }
  request.discover({
    roomResponse: roomID,
    peers: Array.from(rooms[roomID]),
  });

  if (request.socket.roomID !== roomID) {
    request.socket.roomID = roomID;
    rooms[roomID].add(request.socket.id);
  }
});

connectDb()
  .then(() => {
    console.log("db connected");
    server.listen(80, (err) =>
      console.log(err || "server listening on 80")
    );
  })
  .catch((e) => {
    console.log(e.message);
    process.exit(1);
  });
