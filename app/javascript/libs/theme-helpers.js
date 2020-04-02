import { makeStyles, useTheme } from "@material-ui/styles";

export default css => {
  const theme = useTheme();

  return {
    css: makeStyles(css)(),
    theme
  };
};
