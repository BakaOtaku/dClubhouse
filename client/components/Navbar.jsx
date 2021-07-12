import React, { useState, useContext, useRef } from "react";
import Link from 'next/link';
import { useRouter } from "next/router";

// material ui
import { AppBar, Container } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";

// components
import ConnectWallet from "./ConnectWallet";
import { neoContext } from "@contexts/neoContext";

const Navbar = () => {
  const classes = useStyles();
  const router = useRouter();
  const { isAuth } = useContext(neoContext);

  // to toggle the menu
  const [openMenu, setOpenMenu] = useState(false);
  const menuItemContainerRef = useRef(null);
  const toggleMenu = (state) => {
    state
      ? menuItemContainerRef.current.classList.add("open")
      : menuItemContainerRef.current.classList.remove("open");
    setOpenMenu(state);
  };

  return (
    <AppBar position="static" classes={{ root: classes.nav }}>
      <Container className={classes.container}>
        <div className={classes.flexContainer}>

          <Link href="/" style={{ display: "flex" }}>
            <a> <img src="/logo-nav.svg" alt="logo" className={classes.logo} /> </a>
          </Link>

          <div style={{ display: "flex" }}>
            {isAuth &&
              <div className={classes.menuItemContainer} ref={menuItemContainerRef}>
                <Link href="/">
                  <a className={router.pathname == "/" ? "menuItem active" : "menuItem"}>
                    Home
                  </a>
                </Link>
                <Link href="/rooms">
                  <a className={router.pathname == "/rooms" ? "menuItem active" : "menuItem"}>
                    All Rooms
                  </a>
                </Link>
                <Link href="/wallet">
                  <a className={router.pathname == "/wallet" ? "menuItem active" : "menuItem"}>
                    Wallet
                  </a>
                </Link>
              </div>
            }
            {!isAuth &&
              <div className={classes.menuItemContainer} ref={menuItemContainerRef}>
                <Link href="/">
                  <a className={router.pathname == "/" ? "menuItem active" : "menuItem"}>
                    Home
                  </a>
                </Link>
                <Link href="/account">
                  <a className={router.pathname == "/account" ? "menuItem active" : "menuItem"}>
                    Register
                  </a>
                </Link>
              </div>
            }

            <ConnectWallet />

            <MenuIcon
              className={classes.menuIcon}
              onClick={() => {
                openMenu ? toggleMenu(false) : toggleMenu(true);
              }}
            />
          </div>

        </div>
      </Container>
    </AppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.customRule,
  nav: {
    height: "80px",
    boxShadow: "none",
    background: 'inherit',
    borderBottom: "0.5px solid",
    position: "relative",
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    height: "40px",
    "@media (max-width:599px)": {
      height: "30px",
    },
  },
  menuItemContainer: {
    "@media (max-width:599px)": {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      backgroundColor: "#0D121C",
      width: "100%",
      top: "80px",
      left: 0,
      padding: 0,
      height: 0,
      overflow: "hidden",
      transition: "all 0.5s ease",
    },

    "&.open": {
      padding: "20px 0",
      height: "auto",
      transition: "all 0.5s ease",
    },

    "& .menuItem": {
      // color: "white",
      marginRight: "30px",
      fontSize: "16px",
      color: "inherit",
      textDecoration: "none",
      lineHeight: "36px",
      fontFamily: 'Inter,sans-serif',
      fontWeight: 400,

      "&.active": {
        color: "inherit",
        // fontWeight: "bold",
      },

      "&:hover": {
        color: "inherit",
        textDecoration: "underline",
      },

      "@media (max-width:599px)": {
        margin: 0,
        textAlign: "center",
        lineHeight: "50px",
      },
    },
  },
  menuIcon: {
    display: "none",
    "@media (max-width:599px)": {
      display: "block",
      // color: "white",
      marginLeft: "20px",
      marginTop: "6px",
    },
  },
}));

export default Navbar;
