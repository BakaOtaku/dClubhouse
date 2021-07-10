import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";

import { userContext } from "@contexts/userContext";
import Navbar from "@components/Navbar";
import { Button } from "@material-ui/core";

const Index = () => {
  const classes = useStyles();
  const router = useRouter();
  const { setUser } = useContext(userContext);
  const [isLoading, setIsLoading] = useState(false);

  const createRoom = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch("/api/rooms", {
        method: "POST",
        body: JSON.stringify({ state: {} }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        cache: "no-cache",
      });
      const { room } = await res.json();

      setUser(room._id);
      router.push({
        pathname: `/rooms/${room._id}`,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <React.Fragment>
      <Navbar />
      <section className={classes.boxContainer}>
        <h1 className={classes.title}>dClubhouse</h1>
        <hr className={classes.break} />
        <div className={classes.desc}>
          <div className={classes.descText}>
            Change kr denge apne project desc ke hisab se.
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been 
            the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type 
            <br />
            <Button className={classes.btn} onClick={createRoom}>
              {isLoading ? 'Loading...' : '🌱 Start room'}
            </Button>
          </div>
          <img className={classes.descImg} src="/cattery.svg" />
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
  desc: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "20px 0",
    ["@media (max-width:599px)"]: {
      flexDirection: "column-reverse",
    },
  },
  descText: {
    fontSize: 17,
    color: "#EEEEEE",
    fontWeight: 400,
    padding: "30px 30px 0 0",
    ["@media (max-width:599px)"]: {
      padding: "25px 0",
    }
  },
  descImg: {
    width: 200,
    height: 200,
    ["@media (max-width:599px)"]: {
      margin: "auto",
    },
  }
}));

export default Index;
