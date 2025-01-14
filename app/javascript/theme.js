// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import mapKeys from "lodash/mapKeys";
import kebabCase from "lodash/kebabCase";
import { alpha } from "@mui/material";

import importedTheme from "./libs/load-external-theme";

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
  scorpion: "#5f5f5f",
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
  redLow: "#F7D0BA",
  forgotPasswordLink: "var(--c-blue)",
  networkIndicatorBorder: "var(--c-solid-green)",
  navListIcon: "var(--c-dark-grey))",
  navListText: "var(--c-dark-grey)",
  navListTextActive: "var(--c-black)",
  navListIconActive: "var(--c-black)",
  navListBgActive: "var(--c-content-grey)",
  navListDivider: "var(--c-warm-grey-1)",
  drawerHeaderButton: "transparent",
  drawerHeaderButtonText: "var(--c-white)",
  toolbarBackgroundColor: "linear-gradient(to top, var(--c-white), var(--c-light-grey))",
  toolbarBackgroundButton: "var(--c-blue)",
  mobileToolbarBackground:
    // eslint-disable-next-line max-len
    "linear-gradient(to top, var(--c-white), var(--c-light-grey)), linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.14))",
  mobileToolbarHamburgerButton: "rgba(0, 0, 0, 0.54)",
  loginBackgroundGradientStart: "var(--c-blue)",
  loginBackgroundGradientEnd: "var(--c-blue)",
  loginTranslationsButtonBackground: "transparent",
  loginTranslationsButtonText: "var(--c-white)",
  loginButtonBg: "var(--c-blue)",
  loginButtonText: "var(--c-white)",
  ...importedTheme.colors
};

const fontFamily = ["helvetica", "roboto", "arial", "sans-serif"].join(", ");
const fontSizes = [9, 12, 13, 14, 16, 18, 20, 30, 60, 80, 96, 130, 186];
const shadows = ["0 2px 12px 0 rgba(125, 125, 125, 0.23)"];
const drawerWidth = "240px";
const spacing = [1, 2, 3, 4];

const components = {
  MuiCssBaseline: {
    styleOverrides: {
      "#root": {
        display: "flex",
        flexDirection: "column",
        height: ["var(--doc-height, 100vh)", "100dvh"]
      },
      legend: {
        display: "none"
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      elevation3: {
        boxShadow: "0 2px 12px 0 rgba(125, 125, 125, 0.23)"
      },
      elevation2: {
        boxShadow: "0 2px 1px 0 rgba(89, 89, 81, 0.05)"
      }
    }
  },
  MuiAccordionSummary: {
    styleOverrides: {
      content: {
        margin: "0"
      }
    }
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        overflow: "auto",
        textOverflow: "initial",
        whiteSpace: "normal",
        lineHeight: "2em",
        // fontSize: `var(--fs-${isRTL ? 16 : 12})`,
        fontWeight: 700,
        marginBottom: ".5em",
        color: colors.black,
        "&.Mui-focused": {
          color: colors.black
        },
        "&.Mui-disabled": {
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
    }
  },
  MuiInputBase: {
    styleOverrides: {
      root: {
        "&.Mui-disabled": {
          cursor: "not-allowed !important"
        }
      },
      input: {
        "&.Mui-disabled": {
          color: "var(--c-black)",
          cursor: "not-allowed !important",
          opacity: 1,
          WebkitTextFillColor: "var(--c-black)"
        }
      }
    }
  },
  MuiInput: {
    styleOverrides: {
      input: {
        border: "1px solid var(--c-black)",
        borderRadius: "6px",
        "&.Mui-focus": {
          borderColor: colors.yellow
        },
        "&.Mui-read-only": {
          color: colors.black,
          paddingBottom: "3px"
        },
        "&.Mui-read-only ::placeholder": {
          color: colors.black,
          opacity: 1
        }
      },
      formControl: {
        "label + &": {
          marginTop: 0
        }
      }
    }
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        color: colors.black,
        padding: "0 var(--sp-1)",
        "&.Mui-checked": {
          color: `${colors.black} !important`
        }
      }
    }
  },
  MuiRadio: {
    styleOverrides: {
      root: {
        padding: "0 var(--sp-1)",
        "&.Mui-checked": {
          color: `${colors.black} !important`
        }
      }
    }
  },
  MuiFormControlLabel: {
    styleOverrides: {
      root: {
        "&.Mui-disabled": {
          cursor: "not-allowed"
        }
      },
      label: {
        fontSize: "var(--fs-13) !important",
        "&.Mui-disabled": {
          color: colors.black
        }
      }
    }
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        lineHeight: "1.4em",
        whiteSpace: "pre-wrap"
      },
      contained: {
        marginLeft: 0,
        marginRight: 0
      }
    }
  },
  MUIDataTableToolbar: {
    styleOverrides: {
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
    }
  },
  MUIDataTableToolbarSelect: {
    styleOverrides: {
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
    }
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        cursor: "pointer"
      },
      hover: {
        cursor: "pointer",
        "&:hover": {
          background: colors.lightGrey
        }
      }
    }
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: "8px",
        backgroundColor: "var(--c-white)"
      }
    }
  },
  MUIDataTableHeadCell: {
    styleOverrides: {
      root: {
        fontWeight: "900",
        textTransform: "uppercase",
        fontSize: "var(--fs-12)",
        color: `${colors.black}`,
        lineHeight: "1.3em",
        padding: ".5em"
      }
    }
  },
  MuiChip: {
    styleOverrides: {
      sizeSmall: {
        height: "21px",
        fontSize: "var(--fs-12)"
      }
    }
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        justifyContent: "flex-start",
        margin: "var(--sp-1)"
      },
      spacing: {
        gap: "var(--sp-1)"
      }
    }
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        textTransform: "uppercase",
        fontSize: "var(--fs-16)",
        fontWeight: "bold",
        padding: "var(--sp-2)"
      }
    }
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: "0 var(--sp-2)"
      }
    }
  },
  MuiFab: {
    styleOverrides: {
      sizeSmall: {
        width: "36px",
        height: "36px"
      }
    }
  },
  MuiToggleButton: {
    styleOverrides: {
      root: {
        fontWeight: 600,
        textTransform: "none"
      }
    }
  },
  MuiButton: {
    styleOverrides: {
      root: {
        letterSpacing: "normal",
        lineHeight: "normal",
        textTransform: "none",
        fontSize: "var(--fs-14)",
        fontWeight: 600,
        borderRadius: "6px",
        "&.Mui-disabled": {
          color: "rgba(0, 0, 0, 0.26)",
          backgroundColor: `${colors.lightGrey} !important`
        }
      },
      containedPrimary: {
        "&:hover, &:active, &:focus": {
          // TODO: @media is overriding this style
          backgroundColor: "var(--c-blue-hover) !important",
          "&.Mui-disabled": {
            color: "rgba(0, 0, 0, 0.26)",
            backgroundColor: `${colors.lightGrey} !important`
          }
        }
      },
      outlinedPrimary: {
        "&:hover, &:active, &focus": {
          borderColor: "var(--c-blue-hover)",
          color: "var(--c-blue-hover)",
          "&.Mui-disabled": {
            color: "rgba(0, 0, 0, 0.26)",
            backgroundColor: `${colors.lightGrey} !important`
          }
        }
      }
    }
  },
  MuiFormGroup: {
    styleOverrides: {
      root: {
        gap: "var(--sp-2)"
      }
    }
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        fontSize: "var(--fs-13)"
      }
    }
  },
  MuiAutocomplete: {
    styleOverrides: {
      tag: {
        margin: "var(--sp-1)",
        height: "var(--sp-13)",

        "& svg": {
          width: "16px",
          height: "16px"
        }
      }
    }
  },
  MuiListItemText: {
    styleOverrides: {
      root: {
        textAlign: "initial",
        wordBreak: "break-word"
      }
    }
  },
  MuiMenu: {
    defaultProps: {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right"
      },
      transformOrigin: {
        vertical: "top",
        horizontal: "right"
      }
    },
    styleOverrides: {
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
    }
  },
  MuiLink: {
    styleOverrides: {
      root: {
        display: "block",
        cursor: "pointer",
        "&:hover, &:active, &focus": {
          color: "var(--c-blue-hover)"
        }
      }
    }
  },
  MuiStepLabel: {
    styleOverrides: {
      root: {
        fontWeight: 600
      }
    }
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        // padding: 0,
        fontSize: "var(--fs-16)",
        background: "var(--c-white)",
        "&.Mui-focused": {
          borderColor: colors.blue,
          boxShadow: `${alpha(colors.blue, 0.25)} 0 0 0 0.2rem`
        },
        "&.Mui-disabled": {
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
  },
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
      size: "small"
    }
  },
  MuiFormControl: {
    defaultProps: {
      margin: "normal"
    }
  },
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true
    }
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
  components,
  transitions
};

export { setCssVars, fontSizes, colors, spacing, drawerWidth, shadows, fontFamily };
