import React, { useContext } from "react";
import Link from 'next/link';
import Head from 'next/head';
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import Navbar from "@components/Navbar"
import { neoContext } from "@contexts/neoContext";

const Rooms = () => {
  const classes = useStyles();
  const { isAuth } = useContext(neoContext);
  useEffect(() => {
    if (!isAuth) {
      window.location = "/";
    }
  }, [isAuth])

  return (
    <React.Fragment>
      <Head>
        <title>~/cattery/all-rooms/</title>
      </Head>
      <Navbar />
      <section className={classes.boxContainer}>
        <h1 className={classes.title}>Join Room</h1>
        <hr className={classes.break} />
        <div className={classes.descText}>
          List of all active rooms.
        </div>

        <div className={classes.roomList}>
          <div className={classes.room}>
            <h1 className={classes.roomTitle}>Hackathon discussion</h1>
            <Link href="rooms/60ec9b49bd70336e3cabb22a">
              <Button className={classes.btn} >🌱 Join Room</Button>
            </Link>
          </div>
          <div className={classes.room}>
            <h1 className={classes.roomTitle}>Fun Channel</h1>
            <Button className={classes.btn} >🌱 Join Room</Button>
          </div>
          <div className={classes.room}>
            <h1 className={classes.roomTitle}>Games</h1>
            <Button className={classes.btn} >🌱 Join Room</Button>
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
  roomList: {
    margin: "auto",
    display: "flex",
    flexWrap: "wrap",
    display: "grid",
    gridGap: "1.25rem",
    gridTemplateColumns: "repeat(2, 1fr)",
    marginTop: "2rem",
    transition: "0.4s ease-in-out",
    marginTop: 20,
    ["@media (max-width:599px)"]: {
      gridTemplateColumns: "repeat(1, 1fr)",
    },
  },
  room: {
    width: "100%",
    minHeight: "200px",
    borderRadius: 12,
    background: "linear-gradient(180deg,#efa971,#e4cafe)",
    padding: "1.25rem 1.25rem 60px",
    animation: "$bottom_up 1s ease-in-out",

    "&:nth-child(1)": {
      background: "linear-gradient(180deg,#dbb4f3,#efb7d7)"
    },
    "&:nth-child(2)": {
      background: "linear-gradient(180deg,#efa971,#e4cafe)"
    },
    "&:nth-child(3)": {
      background: "linear-gradient(180deg,#b1e5f9,#f4d2fe)"
    },
    "&:nth-child(4)": {
      background: "linear-gradient(90deg,#b1e5f9,#f4d2fe)"
    },
    "&:nth-child(5)": {
      background: "linear-gradient(180deg,#f3cbab,#feedca)"
    },

    "&:hover": {
      transform: "scale(1.02)"
    }
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
  roomTitle: {
    color: "#000",
    fontSize: 25,
    fontWeight: 300,
    letterSpacing: "-.5px",
    margin: 0,
    ["@media (max-width:599px)"]: {
      fontSize: 20,
    },
  }
}));

export default Rooms;
