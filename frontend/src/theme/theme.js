import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#F7F2EA",
      paper: "#FFFDF9",
    },
    text: {
      primary: "#211D19",
      secondary: "#6F665D",
    },
    primary: {
      main: "#211D19",
      contrastText: "#FFFDF9",
    },
    secondary: {
      main: "#B68A3A",
    },
    divider: "#E7DED2",
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontWeight: 500,
      letterSpacing: "-0.035em",
    },
    h2: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontWeight: 500,
      letterSpacing: "-0.025em",
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, minHeight: 44, paddingInline: 20 },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { minWidth: 44, minHeight: 44 },
      },
    },
  },
});

export default theme;
