import { createMuiTheme } from "@material-ui/core/styles";

const colors = {
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
};

export default createMuiTheme({
  direction: "ltr",
  palette: {
    primary: {
      main: colors.blue
    }
  },
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
    shadows: ["0 2px 12px 0 rgba(125, 125, 125, 0.23)"],
    colors,
    components: {
      drawerWidth: "240px"
    }
  },
  overrides: {
    MuiInputLabel: {
      root: {
        color: colors.black,
        "&$focused": {
          color: colors.black
        },
        "&$disabled": {
          color: colors.black
        }
      }
    },
    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: "1px solid #d8d8d8"
        },
        "&:after": {
          borderBottom: `2px solid ${colors.yellow}`
        },
        "&:hover:not($disabled):not($focused):not($error):before": {
          borderBottom: `2px solid ${colors.yellow}`
        }
      }
    },
    MuiCheckbox: {
      root: {
        "&$checked": {
          color: `${colors.black} !important`
        }
      }
    },
    MuiRadio: {
      root: {
        "&$checked": {
          color: `${colors.black} !important`
        }
      }
    },
    MuiFormControlLabel: {
      label: {
        fontSize: "0.875rem"
      }
    }
  }
});
