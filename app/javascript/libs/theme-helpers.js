import { makeStyles, useTheme } from "@material-ui/styles";

export const themeHelper = css => {
  return {
    css: makeStyles(css)(),
    theme: useTheme()
  };
};
