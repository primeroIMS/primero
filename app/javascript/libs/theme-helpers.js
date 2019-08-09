import { makeStyles, useTheme } from "@material-ui/styles";

export const useThemeHelper = css => {
  const theme = useTheme();

  return {
    css: makeStyles(css)(),
    theme
  };
};
