import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#66b72e",
    },
    secondary: {
      light: "#ff7961",
      main: "#1b1425",
      dark: "#ba000d",
      contrastText: "#000",
    },
    background: {
      default: "#fffffe",
      paper: "#fffffe",
    },
    text: {
      primary: "#fffffe",
      secondary: "#66b72e",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "--TextField-brandBorderColor": "#fffffe",
          "--TextField-brandBorderHoverColor": "#66b72e",
          "--TextField-brandBorderFocusedColor": "#66b72e",
          "& label.Mui-focused": {
            color: "var(--TextField-brandBorderFocusedColor)",
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          "&::before, &::after": {
            borderBottom: "2px solid var(--TextField-brandBorderColor)",
          },
          "&:hover:not(.Mui-disabled, .Mui-error):before": {
            borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
          },
          "&.Mui-focused:after": {
            borderBottom: "2px solid var(--TextField-brandBorderFocusedColor)",
          },
        },
      },
    },
  },
});

export default theme;
