import { CssBaseline } from "@material-ui/core";
import { ThemeProvider as MuiThemeProvider, createMuiTheme, StylesProvider, jssPreset } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { useMemo, useEffect, useLayoutEffect, createContext, useReducer, useContext, useCallback } from "react";
import rtl from "jss-rtl";
import { create } from "jss";

import theme, { setCssVars, fontSizes, colors, spacing, drawerWidth, shadows, fontFamily } from "./config/theme";
import { useMemoizedSelector } from "./libs";
import { getAppDirection } from "./components/i18n/selectors";

const themeInitialOptions = {
  direction: "ltr"
};

const useEnhancedEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// eslint-disable-next-line import/exports-last
export const DispatchContext = createContext(() => {});

DispatchContext.displayName = "ThemeDispatchContext";

const jss = create({
  plugins: [...jssPreset().plugins, rtl()],
  insertionPoint: "jss-insertion-point"
});

const ThemeProvider = ({ children }) => {
  const directionFromStore = useMemoizedSelector(state => getAppDirection(state));

  const [options, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "CHANGE": {
        return {
          ...state,
          direction: action.payload.direction || state.direction
        };
      }
      default:
        throw new Error(`Unrecognized type ${action.type}`);
    }
  }, themeInitialOptions);

  const { direction } = options;

  useEnhancedEffect(() => {
    document.body.dir = direction;
  }, [direction]);

  useEffect(() => {
    if (directionFromStore && directionFromStore !== direction) {
      dispatch({ type: "CHANGE", payload: { direction: directionFromStore } });
    }
  }, [directionFromStore, direction]);

  const themeConfig = useMemo(() => {
    const muiTheme = createMuiTheme({ ...theme, direction });

    muiTheme.overrides.MuiCssBaseline["@global"].html = { fontSize: `var(--fs-${direction === "rtl" ? 18 : 16})` };

    muiTheme.overrides.MuiCssBaseline["@global"][":root"] = {
      ...setCssVars("fs", fontSizes, muiTheme.typography.pxToRem),
      ...setCssVars("c", colors),
      ...setCssVars("sp", spacing, muiTheme.spacing, "px"),
      "--ff": fontFamily,
      "--fwb": muiTheme.typography.fontWeightBold,
      "--drawer": drawerWidth,
      "--shadow-0": shadows[0],
      "--shadow-1": shadows[1],
      "--spacing-0-1": muiTheme.spacing(0, 1),
      "--transition": muiTheme.transitions.create("margin", {
        easing: muiTheme.transitions.easing.sharp,
        duration: muiTheme.transitions.duration.leavingScreen
      })
    };

    return muiTheme;
  }, [direction]);

  return (
    <StylesProvider jss={jss}>
      <MuiThemeProvider theme={themeConfig}>
        <DispatchContext.Provider value={dispatch}>
          <CssBaseline />
          {children}
        </DispatchContext.Provider>
      </MuiThemeProvider>
    </StylesProvider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node
};

ThemeProvider.displayName = "ThemeProvider";

export default ThemeProvider;

export const useChangeTheme = () => {
  const dispatch = useContext(DispatchContext);

  return useCallback(options => dispatch({ type: "CHANGE", payload: options }), [dispatch]);
};
