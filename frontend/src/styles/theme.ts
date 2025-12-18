import { createTheme } from "@mui/material/styles";

/**
 * MUI Theme Configuration
 * Matches the Tailwind CSS variables and design tokens.
 */
const theme = createTheme({
  palette: {
    primary: {
      main: "#00639B",
      light: "#CEE5FF",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#006874",
      light: "#97F0FF",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#BA1A1A",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F8F9FF",
      paper: "#F0F4FC",
    },
    text: {
      primary: "#191C20",
      secondary: "#525E7D", // Tertiary color for secondary text often works well
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "57px",
      lineHeight: "64px",
      fontWeight: 400,
    },
    h2: {
      fontSize: "45px",
      lineHeight: "52px",
      fontWeight: 400,
    },
    h3: {
      fontSize: "36px",
      lineHeight: "44px",
      fontWeight: 400,
    },
    h4: {
      fontSize: "32px",
      lineHeight: "40px",
      fontWeight: 400,
    },
    h5: {
      fontSize: "28px",
      lineHeight: "36px",
      fontWeight: 400,
    },
    h6: {
      fontSize: "24px",
      lineHeight: "32px",
      fontWeight: 400,
    },
    subtitle1: {
      // Title Large
      fontSize: "22px",
      lineHeight: "28px",
      fontWeight: 400,
    },
    subtitle2: {
      // Title Medium
      fontSize: "16px",
      lineHeight: "24px",
      fontWeight: 500,
    },
    body1: {
      // Body Large
      fontSize: "16px",
      lineHeight: "24px",
    },
    body2: {
      // Body Medium
      fontSize: "14px",
      lineHeight: "20px",
    },
    button: {
      fontSize: "14px",
      lineHeight: "20px",
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "20px", // Standard M3 pill shape widely used
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0px 1px 3px 1px rgba(0, 0, 0, 0.15)", // Soft shadow
          backgroundColor: "#F0F4FC", // Surface Container
        },
      },
    },
  },
});

export default theme;
