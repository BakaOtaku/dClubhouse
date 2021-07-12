import React, { useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';

import { neoContext } from "@contexts/neoContext";

const ConnectWallet = () => {
  const classes = useStyles();
  const { address } = useContext(neoContext);

  const getNeo = () => {
    window.open("https://chrome.google.com/webstore/detail/neoline/cphhlgmgameodnhkjdmkpanlelnlohao")
  }

  return (
    <button
      className={classes.walletBtn}
      onClick={address.key ? null : getNeo}
    >
      <div>
        {address.key ? truncateAddress(address.key) : "Connect Neo Wallet"}
      </div>
    </button>
  );
}

const truncateAddress = (account) => {
  return account.slice(0, 6) + "..." + account.slice(-4);
};

const useStyles = makeStyles((theme) => ({
  walletBtn: {
    background: '#f38181',
    cursor: 'pointer',
    border: 0,
    outline: 'none',
    borderRadius: 36,
    height: '36px',
    lineHeight: '36px',
    display: 'flex',
    alignItems: 'center',

    "@media (max-width:599px)": {
      padding: 0,
    },

    '&:hover': {
      backgroundColor: '#000',
      color: 'white',
    },

    '& div': {
      "@media (max-width:599px)": {
        margin: 0,
        display: 'none'
      },
    }
  },
  img: {
    borderRadius: '12px',
    marginRight: 5,
    height: '24px !important',
    width: '24px !important',

    "@media (max-width:599px)": {
      marginRight: 0,
      height: '36px !important', width: '36px !important',
      borderRadius: '20px',
    },
  }
}));

export default ConnectWallet;