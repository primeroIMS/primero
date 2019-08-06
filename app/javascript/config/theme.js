import { createMuiTheme } from "@material-ui/core/styles";
import { merge } from "lodash";

const muiTheme = createMuiTheme();

const colors = {
  lightGrey: "#f0f0f0",
  white: "#ffffff",
  black: "#231f20",
  solidBlack: "#000000",
  darkGrey: "#595952",
  blue: "#0093ba",
  yellow: "#f2c317",
  red: "#d0021b",
  green: "#839e3c",
  orange: "#e7712d",
  purple: "#7c347b",
  warmGrey1: "#e0dfd7",
  warmGrey2: "#bcbcad",
  midGrey: "#757472",
  grey: "#4a4a4a",
  contentGrey: "#fbfbfb",
  stickyGrey: "rgba(251, 251, 251, 0.95)"
};

const overrides = {
  MuiPaper: {
    elevation3: {
      boxShadow: "0 2px 12px 0 rgba(125, 125, 125, 0.23)"
    }
  },
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
      color: colors.black,
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
      fontSize: "0.7rem !important",
      "&$disabled": {
        color: colors.black
      }
    },
    disabled: {
      color: colors.black
    }
  },
  MuiFormHelperText: {
    root: {
      lineHeight: "1.4em"
    }
  },
  MUIDataTableToolbar: {
    root: {
      display: "none !important"
    }
  },
  MUIDataTableToolbarSelect: {
    root: {
      display: "none"
    }
  },
  MuiTableRow: {
    hover: {
      "&:hover": {
        background: colors.lightGrey
      }
    }
  },
  MUIDataTableBodyRow: {
    hover: {
      cursor: "pointer"
    }
  },
  MUIDataTableBodyCell: {
    root: {
      padding: "10px",
      [muiTheme.breakpoints.down("sm")]: {
        "&:nth-last-child(2), &:last-child": {
          border: "none"
        }
      }
    },
    cellStacked: {
      [muiTheme.breakpoints.down("sm")]: {
        width: "50%",
        height: "40px",
        display: "flex",
        fontSize: muiTheme.typography.pxToRem(14),
        backgroundColor: colors.white,
        alignItems: "center",
        float: "left",
        fontWeight: 600,
        padding: "2em 10px"
      }
    },
    responsiveStacked: {
      [muiTheme.breakpoints.down("sm")]: {
        width: "50%",
        height: "40px",
        display: "flex",
        fontSize: muiTheme.typography.pxToRem(14),
        alignItems: "center",
        float: "left",
        padding: "2em 0"
      }
    }
  },
  MUIDataTableHeadCell: {
    root: {
      padding: "10px",
      fontWeight: "900",
      textTransform: "uppercase",
      fontSize: muiTheme.typography.pxToRem(12),
      color: `${colors.grey}`
    }
  },
  MuiChip: {
    sizeSmall: {
      height: "21px",
      fontSize: ".7rem"
    }
  }
};

const theme = merge(muiTheme, {
  direction: "ltr",
  palette: {
    primary: {
      main: colors.blue
    },
    secondary: {
      main: colors.blue
    }
  },
  typography: {
    htmlFontSize: 10,
    useNextVariants: true,
    fontFamily: ["helvetica", "roboto", "arial", "sans-serif"].join(", "),
    fontWeight: 600
  },
  primero: {
    colors,
    shadows: ["0 2px 12px 0 rgba(125, 125, 125, 0.23)"],
    components: {
      drawerWidth: "240px"
    }
  },
  overrides
});

export default theme;
