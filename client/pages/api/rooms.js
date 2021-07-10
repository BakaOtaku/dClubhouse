import nc from "next-connect";
import { connectToDatabase } from "./../../utils/db";
import { ObjectId } from "mongodb";

const createRoom = async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const { ops: [room], } = await db.collection("rooms").insertOne({ state: {} });
    res.send({ success: true, room });
  } catch (error) {
    console.error(error);
    return res.send({ success: false, message: error.message });
  }
}
const updateRoom = async (req, res) => {
  const { roomId, updates } = req.body;

  try {
    const { db } = await connectToDatabase();
    const room = await db
      .collection("rooms")
      .updateOne(
        { _id: ObjectId(roomId) },
        { $set: { state: updates } },
        { returnOriginal: false }
      );
    res.send({ success: true, room });
  } catch (error) {
    console.error(error);
    res.send({ success: false, message: error.message });
  }
}

const handler = nc();
handler.post(createRoom).put(updateRoom);
export default handler;
