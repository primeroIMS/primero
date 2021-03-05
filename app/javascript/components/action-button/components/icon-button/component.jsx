import PropTypes from "prop-types";
import { Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

import { NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({ icon, isTransparent, rest }) => {
  const css = useStyles();
  const { className, ...res } = rest;
  const classes = clsx(css.iconActionButton, {
    [css.isTransparent]: isTransparent,
    [className]: Boolean(className)
  });

  return (
    <Fab className={classes} size="small" {...res}>
      {icon}
    </Fab>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  icon: PropTypes.object,
  isTransparent: PropTypes.bool,
  rest: PropTypes.object,
  text: PropTypes.string
};

export default Component;
