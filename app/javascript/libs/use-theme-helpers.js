import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import { useSelector } from "react-redux";

import { getAppDirection } from "../components/i18n/selectors";

export default ({ css, theme: customTheme } = {}) => {
  const theme = useTheme();
  const direction = useSelector(state => getAppDirection(state));
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));
  const themeWithDirection = { ...theme, ...customTheme, direction };
  const themeProps = {
    theme: themeWithDirection,
    mobileDisplay
  };

  if (css) {
    return {
      css: makeStyles(css)(),
      ...themeProps
    };
  }

  return themeProps;
};
