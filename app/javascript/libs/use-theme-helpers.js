import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";

import { getAppDirection } from "../components/i18n/selectors";
import { ORIENTATION } from "../components/i18n/constants";

import useMemoizedSelector from "./use-memoized-selector";

export default ({ css, theme: customTheme } = {}) => {
  const theme = useTheme();

  const direction = useMemoizedSelector(state => getAppDirection(state));

  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));
  const themeWithDirection = { ...theme, ...customTheme, direction };

  return {
    ...(css && { css: makeStyles(css)() }),
    isRTL: direction === ORIENTATION.rtl,
    theme: themeWithDirection,
    mobileDisplay
  };
};
