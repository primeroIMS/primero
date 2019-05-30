import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  direction: "ltr",
  typography: {
    useNextVariants: true,
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "avenir next",
      "avenir",
      "helvetica neue",
      "helvetica",
      "ubuntu",
      "roboto",
      "noto",
      "segoe ui",
      "arial",
      "sans-serif"
    ].join(","),
    fontWeight: 600
  },
  primero: {
    colors: {
      lightGrey: "#f0f0f0",
      white: "#ffffff",
      black: "#231f20",
      darkGrey: "#595952",
      blue: "#0093ba",
      yellow: "#f2c317",
      red: "#d0021b",
      green: "#839e3c",
      orange: "#e7712d",
      purple: "#7c347b",
      warmGrey1: "#e0dfd7",
      warmGrey2: "#bcbcad",
      midGrey: "#757472"
    },
    components: {
      drawerWidth: "240px"
    }
  }
});
