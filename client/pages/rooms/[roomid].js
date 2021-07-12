import React, { useEffect, useRef, useState, useContext } from "react";
import Head from 'next/head';
import { useRouter } from "next/router";
import { ObjectId } from "mongodb";
import { io } from "socket.io-client";
import SimpleSignalClient from "simple-signal-client";
import Hark from "hark";
import Faker from "faker";
// components
import Form from "@components/Form";
import Navbar from "@components/Navbar";
import { connectToDatabase } from "@utils/db";
import { userContext } from "@contexts/userContext";
import { neoContext } from "@contexts/neoContext";
// material ui
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

export async function getServerSideProps(ctx) {
  const { roomid } = ctx.query;
  const { db } = await connectToDatabase();
  const room = await db.collection("rooms").findOne({ _id: ObjectId(roomid) });
  return {
    props: {
      roomDetails: room.state || {},
    }
  };
}

const Room = ({ roomDetails }) => {
  const classes = useStyles();
  const router = useRouter();
  const [toggleSettings, setToggleSettings] = useState(false);
  const [members, setMembers] = useState([]);
  const [streams, setStreams] = useState([]);
  const [state, setState] = useState(roomDetails);
  const speakersRef = useRef(new Map());
  const { userRef } = useContext(userContext);
  const isAuthor = Boolean(userRef.current);
  const isAdmin = Boolean(userRef.current);
  const socketRef = useRef();
  const [tempPromoted, setTempPromoted] = useState();

  const { isAuth } = useContext(neoContext);
  useEffect(() => {
    if (!isAuth) {
      window.location = "/";
    }
  }, [isAuth])

  const promote = (id) => {
    if (isAdmin) {
      socketRef.current.emit("promote", id);
    }
  }
  const demote = (id) => {
    socketRef.current.emit("demote", id);
  }
  useEffect(() => {
    if (tempPromoted) {
      streams.forEach((str) => {
        if (str.id === tempPromoted) {
          const audioObj = new Audio();
          audioObj.srcObject = str;
          audioObj.play();
          speakersRef.current[str.id] = audioObj;
          setTempPromoted(null);
        }
      });
    }
  }, [tempPromoted]);

  useEffect(() => {
    console.log(state);
    window.document.documentElement.style.setProperty(
      "--base",
      state["jam-room-color"] || "rgb(75, 85, 99)"
    );
  }, [state]);

  useEffect(() => {
    const speakerStreams = streams.filter((str) => {
      return members.find((m) => m.streamId === str.id && m.speaker && !speakersRef.current[str.id]);
    });
    speakerStreams.forEach((str) => {
      const audioObj = new Audio();
      audioObj.srcObject = str;
      audioObj.play();
      speakersRef.current[str.id] = audioObj;
    });
  }, [streams]);

  const connectToPeer = async (signalClient, roomId, peerID, localStream) => {
    const { peer } = await signalClient.connect(peerID, roomId);
    onPeer(peer, localStream);
  }

  const onPeer = (peer, stream) => {
    peer.addStream(stream);
    peer.on("stream", (remote) => {
      setStreams((s) => [...s, remote]);
    });
    peer.on("error", (e) => console.log(e));
  }

  const doThings = async (signalClient, socket, roomId) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const user = {
      name: Faker.name.firstName(),
      speaker: isAuthor,
      streamId: stream.id,
      isAdmin,
    };
    const options = {};
    const speechEvents = Hark(stream, options);

    speechEvents.on("speaking", function () {
      socket.emit("speaking", stream.id);
    });
    setStreams((s) => [...s, stream]);
    socket.emit("joinRoom", JSON.stringify({ id: roomId, user }));
    socket.on("delete", (d) => {
      speakersRef.current[d]?.pause();
      speakersRef.current.delete(d);
      setStreams((s) => s.filter((d) => d.id !== d));
    });

    socket.on("users", (d) => {
      setMembers(JSON.parse(d));

      signalClient.discover(roomId);
    });
    async function onRoomPeers(discoveryData) {
      discoveryData.peers.length &&
        (await Promise.all([
          discoveryData.peers.map((id) =>
            connectToPeer(signalClient, roomId, id, stream)
          ),
        ]));
      signalClient.removeListener("discover", onRoomPeers);
    }
    signalClient.addListener("discover", onRoomPeers);

    signalClient.on("request", async (request) => {
      try {
        const { peer } = await request.accept();

        onPeer(peer, stream);
      } catch (error) {
        console.log(error);
      }
    });
  }

  useEffect(() => {
    const roomId = new URLSearchParams(window.location.search).get("roomid");
    const socket = io("http://localhost:80");
    socketRef.current = socket;
    const signalClient = new SimpleSignalClient(socket);

    socket.on("update", (d) => {
      setState(d.state);
    });
    socket.on("lift", (id) => {
      setTempPromoted(id);
    });
    socket.on("spoke", (spokeId) => {
      const doc = document.querySelector(`[data-speaking="${spokeId}"]`);
      if (doc) {
        doc.classList.add("speaking");
        setTimeout(() => {
          doc.classList.remove("speaking");
        }, 1000);
      }
    });
    doThings(signalClient, socket, roomId);
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>~/cattery/room/</title>
      </Head>
      <Navbar />
      <section className={classes.boxContainer}>
        <h1 className={classes.title}>Fun Channel</h1>
        <hr className={classes.break} />

        {toggleSettings && (
          <div className="settings">
            <div className="frame">
              <h2>Room Settings</h2>
              <Form
                toggler={() => setToggleSettings((s) => !s)}
                setState={setState}
              />
            </div>
          </div>
        )}


        {isAuthor && (
          <div className="icon-settings">
            <i
              className="fa fa-cog"
              aria-hidden="true"
              onClick={() => setToggleSettings((s) => !s)}
              style={{
                cursor: "pointer",
              }}
            ></i>
          </div>
        )}

        <h3 className={`${classes.heading} ${classes.descText}`}>Speakers</h3>
        <div className={classes.speakers}>
          {console.log(members)}
          {members.filter((s) => s.speaker)
            .map((str) => (
              <div className={classes.speaker} key={str.name}>
                <div className={classes.speakerBlob}
                  data-speaking={str.streamId}
                >
                  {str.isAdmin ? "👑" : str.name[0]}
                </div>
                <p>{str.name}</p>
                {/* <p>{ind === 0 ? "NdfY...hqrP" : "NUqs...tgWj"}</p> */}
              </div>
            ))}
        </div>

        <h3 className={`${classes.heading} ${classes.descText}`}>Audience</h3>
        <div className={classes.speakers}>
          {members.filter((s) => !s.speaker)
            .map((str) => (
              <div className={classes.speaker} key={str.streamId}>
                <div className={classes.speakerBlob}
                  title="tap to promote"
                  onClick={() => promote(str.streamId)}
                >
                  {str.name[0]}
                </div>
                <p>{str.name}</p>
                {/* <p>{ind === 0 ? "NdfY...hqrP" : "NUqs...tgWj"}</p> */}
              </div>
            ))}
          {/* {members.filter((s) => !s.speaker).length === 0 && "No one is here."} */}
        </div>

        <div className={classes.bottom}>
          <Button className={classes.btnRoom}
            onClick={(e) => {
              e.preventDefault();
              socketRef.current.close();
              streams.forEach((s) => {
                speakersRef.current[s.id] &&
                  speakersRef.current[s.id].pause();
              });
              speakersRef.current.clear();
              router.replace("/");
            }}
          >
            👋🏻 Leave quietly
          </Button>
          <div>
            <Button className={classes.btnRoom}>🎙️</Button>
            <Button className={classes.btnRoom}>🖐🏻</Button>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.customRule,
  title: {
    fontSize: 40,
    fontWeight: 400,
    margin: 0,
    ["@media (max-width:599px)"]: {
      fontSize: 25,
    },
  },
  break: {
    border: "none",
    height: 1.2,
    background: "linear-gradient(to right, rgb(80, 250, 123), rgb(21, 101, 192))"
  },
  descText: {
    fontSize: 17,
    color: "#EEEEEE",
    fontWeight: 400,
    padding: "20px 20px 0 0"
  },
  heading: {
    fontSize: 20,
    marginBottom: 25
  },
  speakers: {
    margin: "15px auto",
    flexWrap: "wrap",
    display: "grid",
    gridGap: "1.25rem",
    gridTemplateColumns: "repeat(4, 1fr)",
    ["@media (max-width:800px)"]: {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    ["@media (max-width:400px)"]: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
  speaker: {
    margin: "auto",
    textAlign: "center",
    animation: "$bottom_up 1s ease-in-out",
  },
  "@keyframes bottom_up": {
    "0%": {
      opacity: 0,
      transform: "translateY(40px)"
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)"
    }
  },
  speakerBlob: {
    width: 100,
    height: 100,
    borderRadius: 50,
    background: "linear-gradient(to right, rgb(80, 250, 123), rgb(21, 101, 192))",
    padding: "1.25rem 1.25rem 60px",

    "&:nth-child(1)": {
      background: "url('/1.jpg')",
      backgroundSize: 'contain',
    },
    "&:nth-child(1)": {
      background: "url('/2.jpg')",
      backgroundSize: 'contain',
    },
  },

  bottom: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 25
  },
  btnRoom: {
    color: "rgb(255 255 255)",
    width: "max-content",
    height: 56,
    marginRight: 10,
    fontSize: 17,
    padding: "0 15px",
    borderRadius: 25,
    textTransform: "capitalize",
    backgroundColor: "#D1D9D9",
    color: "#EE6F57",
    "&:hover": {
      backgroundColor: "#D1D9D9",
    },
  }
}));

export default Room;
