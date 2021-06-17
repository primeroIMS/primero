import { createMuiTheme } from "@material-ui/core/styles";
import merge from "lodash/merge";

import { ORIENTATION } from "../components/i18n/constants";

const muiTheme = createMuiTheme();

const theme = (direction = ORIENTATION.ltr) => {
  const isRTL = direction === ORIENTATION.rtl;

  const colors = {
    darkBrown: "#5a5549",
    lightGrey: "#f0f0f0",
    white: "#ffffff",
    chromeWhite: "#e6efd4",
    black: "#231f20",
    solidBlack: "#000000",
    darkGrey: "#595952",
    lightBlue: "rgba(0, 147, 186, 0.25)",
    blue: "#0093ba",
    darkBlue: "#048BB0",
    yellow: "#f2c317",
    moonYellow: "#f2b417",
    goldYellow: "#f4ac22",
    red: "#d0021b",
    redLabelError: "#f44336",
    green: "#839e3c",
    solidGreen: "#7ba024",
    orange: "#e7712d",
    solidOrange: "#ff9500",
    purple: "#7c347b",
    warmGrey1: "#e0dfd7",
    warmGrey2: "#bcbcad",
    warmGrey3: "#b9b8b3",
    warmGrey4: "#9a988f",
    warmGrey5: "#d5d5d5",
    warmGrey6: "#6f6f6a",
    midGrey: "#757472",
    tundora: "#454545",
    grey: "#4a4a4a",
    contentGrey: "#fbfbfb",
    stickyGrey: "rgba(251, 251, 251, 0.95)",
    lightGrey2: "#e0e0e0",
    atlantis: "#8bb827",
    wildSand: "#f5f5f5",
    lightBlueMenu: "#dfeff4"
  };

  const overrides = {
    MuiCssBaseline: {
      "@global": {
        html: {
          fontSize: muiTheme.typography.pxToRem(isRTL ? 18 : 16)
        },
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
        fontSize: muiTheme.typography.pxToRem(isRTL ? 15 : 12),
        marginBottom: ".5em",
        color: colors.black,
        "&$focused": {
          color: colors.black
        },
        "&$disabled": {
          color: colors.black
        }
      },
      shrink: {
        transform: "none"
      },
      formControl: {
        position: "relative"
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
          cursor: "not-allowed !important"
        }
      }
    },
    MuiInput: {
      root: {
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
      },
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
    MuiFormControl: {
      root: {
        marginBottom: "1em"
      }
    },
    MuiFormControlLabel: {
      root: {
        "&$disabled": {
          cursor: "not-allowed"
        }
      },
      label: {
        fontSize: "0.7rem !important",
        "&$disabled": {
          color: colors.black
        }
      }
    },
    MuiFormHelperText: {
      root: {
        lineHeight: "1.4em",
        whiteSpace: "pre-wrap"
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
        fontSize: muiTheme.typography.pxToRem(12),
        color: `${colors.grey}`,
        lineHeight: "1.3em",
        padding: ".5em"
      }
    },
    MuiChip: {
      sizeSmall: {
        height: "21px",
        fontSize: ".7rem"
      }
    },
    MuiDialogActions: {
      root: {
        justifyContent: "flex-start",
        margin: "1em"
      }
    },
    MuiDialogTitle: {
      root: {
        textTransform: "uppercase",
        fontSize: muiTheme.typography.pxToRem(17),
        fontWeight: "bold"
      }
    },
    MuiSnackbarContent: {
      root: {
        backgroundColor: `${colors.white} !important`,
        color: `${colors.grey} !important`,
        fontWeight: "bold !important",
        fontSize: `${muiTheme.typography.pxToRem(12)} !important`
      },
      message: {
        flex: "1 0",
        backgroundColor: `${colors.white} !important`,
        "& svg": {
          fontSize: `${muiTheme.typography.pxToRem(16)} !important`,
          marginRight: "5px"
        }
      },
      action: {
        paddingLeft: 0,
        backgroundColor: `${colors.white} !important`,
        "& svg": {
          fontSize: `${muiTheme.typography.pxToRem(16)} !important`,
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
    MuiButton: {
      root: {
        lineHeight: "1.43",

        "&$disabled": {
          color: "rgba(0, 0, 0, 0.26)",
          backgroundColor: `${colors.lightGrey} !important`
        }
      }
    },
    MuiAutocomplete: {
      inputRoot: {
        '&[class*="MuiInput-root"]': {
          paddingBottom: "3px"
        }
      },
      tag: {
        margin: 0
      }
    },
    MuiListItemText: {
      root: {
        wordBreak: "break-word"
      }
    }
  };

  const props = {
    MuiButtonBase: {
      disableRipple: true
    }
  };

  const transitions = {
    create: () => "none"
  };

  return merge(muiTheme, {
    direction,
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
    overrides,
    props,
    transitions
  });
};

export default theme;
