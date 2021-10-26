import { CssBaseline } from "@material-ui/core";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  StylesProvider,
  createGenerateClassName,
  jssPreset
} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { useMemo, useEffect, useLayoutEffect, createContext, useReducer, useContext, useCallback } from "react";
import { create } from "jss";
import rtl from "jss-rtl";

import theme from "./config/theme";

const themeInitialOptions = {
  direction: "rtl"
};

const useEnhancedEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const generateClassName = createGenerateClassName();

// eslint-disable-next-line import/exports-last
export const DispatchContext = createContext(() => {});

DispatchContext.displayName = "ThemeDispatchContext";

const ThemeProvider = ({ children }) => {
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
    document.documentElement.dir = direction;
  }, [direction]);

  const themeConfig = useMemo(() => {
    return createTheme({ ...theme, direction });
  }, [direction]);

  const jss = create({
    plugins: [...jssPreset().plugins, rtl()]
  });

  return (
        <StylesProvider jss={jss} injectFirst flip>
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
