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
  }
});
