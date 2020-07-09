import React from "react";
import PropTypes from "prop-types";
import { Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ icon, isTransparent, rest }) => {
  const css = makeStyles(styles)();

  return (
    <Fab
      className={clsx(css.iconActionButton, {
        [css.isTransparent]: isTransparent
      })}
      size="small"
      {...rest}
    >
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
