import makeStyles from "@material-ui/styles/makeStyles";
import useTheme from "@material-ui/styles/useTheme";

export const themeHelper = css => {
  return {
    css: makeStyles(css)(),
    theme: useTheme()
  };
};
