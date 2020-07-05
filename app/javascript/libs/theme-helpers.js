import { makeStyles, useTheme } from "@material-ui/styles";
import { useMediaQuery } from "@material-ui/core";

export default css => {
  const theme = useTheme();
  const mobileDisplay = useMediaQuery(theme.breakpoints.down("sm"));

  return {
    css: makeStyles(css)(),
    theme,
    mobileDisplay
  };
};
