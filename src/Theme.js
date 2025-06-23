import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: { main: "#d32f2f" },
    secondary: { main: "#1976d2" },
    background: { default: "#fff8f8" },
    error: { main: "#ff1744" }
  },
  typography: {
    fontFamily: [
      "Cairo",
      "Tajawal",
      "Arial",
      "sans-serif"
    ].join(","),
    h5: { fontWeight: "bold" }
  },
  shape: {
    borderRadius: 16
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: "bold",
          fontSize: "1.1rem"
        }
      }
    }
  }
});

export default theme;