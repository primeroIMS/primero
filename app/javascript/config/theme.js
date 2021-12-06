import { fade } from "@material-ui/core/styles";
import mapKeys from "lodash/mapKeys";
import kebabCase from "lodash/kebabCase";

const generateCssVarKey = (prefix, key) => `--${prefix}-${kebabCase(key)}`;

const valueWithUnit = (value, unit) => (unit ? `${value}${unit}` : value);

const setCssVars = (prefix, vars, func, unit) => {
  if (Array.isArray(vars)) {
    return vars.reduce(
      (prev, current) => ({ ...prev, [generateCssVarKey(prefix, current)]: valueWithUnit(func(current), unit) }),
      {}
    );
  }

  return mapKeys(vars, (_, key) => generateCssVarKey(prefix, key));
};

const colors = {
  black: "#231f20", // u
  blue: "#0F809E", // u
  lightBlue: "#239EBF", // u
  blueHover: "#0B6178", // u
  blueHoverLight: "rgba(15, 128, 158, .18)", // u
  whiteHover: "#e6efd4", // u
  contentGrey: "#fbfbfb", // u
  darkBlue: "#048BB0",
  darkBrown: "#5a5549",
  darkGrey: "#595952", // u
  goldYellow: "#f4ac22",
  green: "#839e3c", // u
  grey: "#4a4a4a", // u
  lightBlueRgba: "rgba(0, 147, 186, 0.25)", // u
  lightBlueMenu: "#dfeff4",
  lightGrey: "#f0f0f0", // u
  lightGrey2: "#e0e0e0",
  midGrey: "#757472", // u
  yellow: "#f2b417", // u
  orange: "#C4540C", // u
  purple: "#7c347b", // u
  red: "#d0021b", // u
  redLabelError: "#f44336",
  solidBlack: "#000000",
  solidGreen: "#7ba024",
  solidOrange: "#ff9500",
  stickyGrey: "rgba(251, 251, 251, 0.95)",
  tundora: "#454545",
  warmGrey1: "#e0dfd7",
  warmGrey2: "#bcbcad",
  warmGrey3: "#b9b8b3",
  warmGrey4: "#9a988f",
  warmGrey5: "#d5d5d5",
  warmGrey6: "#6f6f6a",
  white: "#ffffff", // u
  wildSand: "#f5f5f5",
  greenLight: "#E6EED3", // u,
  redMedium: "#E7712D",
  redLow: "#F7D0BA"
};

const fontFamily = ["helvetica", "roboto", "arial", "sans-serif"].join(", ");
const fontSizes = [9, 12, 13, 14, 16, 18, 20, 30, 96, 130, 186];
const shadows = ["0 2px 12px 0 rgba(125, 125, 125, 0.23)"];
const drawerWidth = "240px";
const spacing = [1, 2, 3, 4];

const overrides = {
  MuiCssBaseline: {
    "@global": {
      "#root": {
        display: "flex",
        flexDirection: "column",
        height: "100vh"
      },
      legend: {
        display: "none"
      }
    }
  },
  MuiPaper: {
    elevation3: {
      boxShadow: "0 2px 12px 0 rgba(125, 125, 125, 0.23)"
    },
    elevation2: {
      boxShadow: "0 2px 1px 0 rgba(89, 89, 81, 0.05)"
    }
  },
  MuiAccordionSummary: {
    content: {
      margin: "0"
    }
  },
  MuiInputLabel: {
    root: {
      lineHeight: "1.5em",
      // fontSize: `var(--fs-${isRTL ? 16 : 12})`,
      fontWeight: 700,
      marginBottom: ".5em",
      color: colors.black,
      "&$focused": {
        color: colors.black
      },
      "&$disabled": {
        color: colors.black
      }
    },
    outlined: {
      marginBottom: 0
    },
    shrink: {
      transform: "none !important"
    },
    formControl: {
      position: "relative"
    },
    asterisk: {
      color: "var(--c-red)"
    }
  },
  MuiInputBase: {
    root: {
      "&$disabled": {
        cursor: "not-allowed !important"
      }
    },
    input: {
      "&$disabled": {
        color: "var(--c-black)",
        cursor: "not-allowed !important"
      }
    }
  },
  MuiInput: {
    input: {
      border: "1px solid var(--c-black)",
      borderRadius: "6px",
      "$:focus": {
        borderColor: colors.yellow
      },
      "&:read-only": {
        color: colors.black,
        paddingBottom: "3px"
      },
      "&:read-only ::placeholder": {
        color: colors.black,
        opacity: 1
      }
    },
    formControl: {
      "label + &": {
        marginTop: 0
      }
    }
  },
  MuiCheckbox: {
    root: {
      color: colors.black,
      padding: "0 var(--sp-1)",
      "&$checked": {
        color: `${colors.black} !important`
      }
    }
  },
  MuiRadio: {
    root: {
      padding: "0 var(--sp-1)",
      "&$checked": {
        color: `${colors.black} !important`
      }
    }
  },
  MuiFormControlLabel: {
    root: {
      "&$disabled": {
        cursor: "not-allowed"
      }
    },
    label: {
      fontSize: "var(--fs-13) !important",
      "&$disabled": {
        color: colors.black
      }
    }
  },
  MuiFormHelperText: {
    root: {
      lineHeight: "1.4em",
      whiteSpace: "pre-wrap"
    },
    contained: {
      marginLeft: 0,
      marginRight: 0
    }
  },
  MUIDataTableToolbar: {
    root: {
      paddingLeft: "5px",
      paddingRight: "5px",
      paddingTop: "8px",
      paddingBottom: "8px",
      justifyContent: "flex-start"
    },
    titleText: {
      position: "absolute",
      left: "-10000px",
      top: "auto",
      width: "1px",
      height: "1px",
      overflow: "hidden"
    },
    left: {
      display: "none !important"
    }
  },
  MUIDataTableToolbarSelect: {
    root: {
      paddingLeft: "5px",
      paddingRight: "5px",
      paddingTop: "8px",
      paddingBottom: "8px",
      justifyContent: "flex-start",
      backgroundColor: colors.white,
      boxShadow: "none"
    },
    title: {
      display: "none"
    }
  },
  MuiTableRow: {
    hover: {
      cursor: "pointer",
      "&:hover": {
        background: colors.lightGrey
      }
    }
  },
  MUIDataTableHeadCell: {
    root: {
      fontWeight: "900",
      textTransform: "uppercase",
      fontSize: "var(--fs-12)",
      color: `${colors.black}`,
      lineHeight: "1.3em",
      padding: ".5em"
    }
  },
  MuiChip: {
    sizeSmall: {
      height: "21px",
      fontSize: "var(--fs-12)"
    }
  },
  MuiDialogActions: {
    root: {
      justifyContent: "flex-start",
      margin: "var(--sp-1)"
    },
    spacing: {
      gap: "var(--sp-1)"
    }
  },
  MuiDialogTitle: {
    root: {
      textTransform: "uppercase",
      fontSize: "var(--fs-16)",
      fontWeight: "bold",
      padding: "var(--sp-2)"
    }
  },
  MuiDialogContent: {
    root: {
      padding: "0 var(--sp-2)"
    }
  },
  MuiSnackbarContent: {
    root: {
      backgroundColor: `${colors.white} !important`,
      color: `${colors.grey} !important`,
      fontWeight: "bold !important",
      fontSize: "var(--fs-13) !important"
    },
    message: {
      flex: "1 0",
      backgroundColor: `${colors.white} !important`,
      "& svg": {
        fontSize: "var(--fs-16) !important",
        marginRight: "5px"
      }
    },
    action: {
      paddingLeft: 0,
      backgroundColor: `${colors.white} !important`,
      "& svg": {
        fontSize: "$var(--fs-16) !important",
        color: `${colors.darkGrey} !important`
      }
    }
  },
  MuiFab: {
    sizeSmall: {
      width: "36px",
      height: "36px"
    }
  },
  MuiToggleButton: {
    root: {
      fontWeight: 600,
      textTransform: "none"
    }
  },
  MuiButton: {
    root: {
      letterSpacing: "normal",
      lineHeight: "normal",
      textTransform: "none",
      fontSize: "var(--fs-14)",
      fontWeight: 600,
      borderRadius: "6px",
      "&$disabled": {
        color: "rgba(0, 0, 0, 0.26)",
        backgroundColor: `${colors.lightGrey} !important`
      }
    },
    containedPrimary: {
      "&:hover, &:active, &:focus": {
        backgroundColor: "var(--c-blue-hover)"
      }
    },
    outlinedPrimary: {
      "&:hover, &:active, &focus": {
        borderColor: "var(--c-blue-hover)",
        color: "var(--c-blue-hover)"
      }
    }
  },
  MuiFormGroup: {
    root: {
      gap: "var(--sp-2)"
    }
  },
  MuiFormLabel: {
    root: {
      fontSize: "var(--fs-13)"
    }
  },
  MuiAutocomplete: {
    inputRoot: {
      padding: "0  !important"
    },
    tag: {
      margin: "var(--sp-1)",
      height: "var(--sp-13)",

      "& svg": {
        width: "16px",
        height: "16px"
      }
    }
  },
  MuiListItemText: {
    root: {
      textAlign: "initial",
      wordBreak: "break-word"
    }
  },
  MuiMenu: {
    paper: {
      borderRadius: "6px",
      overflow: "visible",
      marginTop: "var(--sp-1)",
      "&::before": {
        backgroundColor: "var(--c-white)",
        content: '""',
        display: "block",
        position: "absolute",
        width: 12,
        height: 12,
        top: -6,
        transform: "rotate(45deg)",
        right: 12,
        zIndex: 10
      },
      "&::after": {
        backgroundColor: "var(--c-white)",
        content: '""',
        display: "block",
        position: "absolute",
        width: 12,
        height: 12,
        top: -6,
        transform: "rotate(45deg)",
        right: 12,
        zIndex: -10,
        boxShadow: shadows[2]
      }
    }
  },
  MuiLink: {
    root: {
      display: "block",
      cursor: "pointer",
      "&:hover, &:active, &focus": {
        color: "var(--c-blue-hover)"
      }
    }
  },
  MuiStepLabel: {
    root: {
      fontWeight: 600
    }
  },
  MuiOutlinedInput: {
    root: {
      padding: 0,
      fontSize: "var(--fs-16)",
      background: "var(--c-white)",
      "&$focused": {
        borderColor: colors.blue,
        boxShadow: `${fade(colors.blue, 0.25)} 0 0 0 0.2rem`
      },
      "&$disabled": {
        "& .MuiChip-root": {
          opacity: 1
        },
        "& .MuiChip-root .MuiChip-deleteIcon": {
          display: "none"
        },
        "& fieldset.MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--c-warm-grey-2)"
        }
      }
    },
    input: {
      padding: "var(--sp-1)"
    },
    multiline: {
      padding: "var(--sp-1)"
    },
    notchedOutline: {
      borderColor: "var(--c-black)",
      top: 0,
      "& legend": {
        display: "none"
      }
    }
  }
};

const props = {
  MuiButtonBase: {
    disableRipple: true
  },
  MuiMenu: {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "right"
    }
  },
  MuiTextField: {
    variant: "outlined"
  }
};

const transitions = {
  create: () => "none"
};

export default {
  palette: {
    primary: {
      main: colors.blue
    },
    secondary: {
      main: colors.blue
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily,
    fontWeight: 600
  },
  primero: {
    colors,
    shadows,
    components: {
      drawerWidth
    }
  },
  overrides,
  props,
  transitions
};

export { setCssVars, fontSizes, colors, spacing, drawerWidth, shadows, fontFamily };
