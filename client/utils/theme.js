import { createTheme } from '@material-ui/core/styles'

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          backgroundColor: "#0D121C",
          backgroundImage: `url()`,
          padding: 0,
          margin: 0
        }
      }
    },
    customRule: {
      container: {
        maxWidth: "1080px",
        margin: "auto",
        padding: "0",
        ["@media (max-width:1120px)"]: {
          padding: "0 20px",
        },
        ["@media (max-width:599px)"]: {
          padding: "0 15px",
        },
      },
      btn: {
        color: "rgb(255 255 255)",
        width: "180px",
        border: "1px solid #CCD6F6",
        height: 56,
        marginTop: 24,
        textAlign: "center",
        fontWeight: 600,
        borderRadius: 10,
        textTransform: "capitalize",
        backgroundColor: "#172A45",
        border: "1px solid #3C8DAD",
        "&:hover": {
          backgroundColor: "rgb(23,42,69,0.8)",
        },
      },
      boxContainer: {
        padding: "30px",
        margin: "50px auto",
        maxWidth: "950px",
        minHeight: 500,
        height: "max-content",
        backgroundColor: "#191F2A",
        color: '#fff',
        filter: "drop-shadow(0px 2px 24px rgba(0, 0, 0, 0.1))",
        borderRadius: 16,
        ["@media (max-width:599px)"]: {
          padding: "25px 15px",
          margin: "15px auto",
          borderRadius: 20,
        },
      }
    },
  },
  typography: {
    fontFamily: ['"Nunito Sans"', "sans-serif"].join(","),

    h1: {
      fontWeight: 400,
      fontSize: "2.5rem",
      lineHeight: "normal",
      letterSpacing: "normal",
    },
  },
  palette: {
    primary: {
      main: "#8247E5",
    },
  },
});

export default theme;