import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import merge from "lodash/merge";
import isFunction from "lodash/isFunction";

import { getAppDirection } from "../components/i18n/selectors";
import { ORIENTATION } from "../components/i18n/constants";

import useMemoizedSelector from "./use-memoized-selector";

export default ({ css, overrides = {} } = {}) => {
  const appTheme = useTheme();
  const themeOverrides = isFunction(overrides) ? overrides(appTheme) : overrides;
  const mobileDisplay = useMediaQuery(appTheme.breakpoints.down("sm"));
  const theme = merge(appTheme, themeOverrides);

  const direction = useMemoizedSelector(state => getAppDirection(state));

  const isRTL = direction === ORIENTATION.rtl;

  return {
    ...(css && { css: makeStyles(css)() }),
    isRTL,
    theme,
    mobileDisplay
  };
};
