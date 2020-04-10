import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import { VALUE_CONTAINER_NAME as NAME } from "./constants";
import styles from "./styles.css";

const ValueContainer = props => {
  const css = makeStyles(styles)();
  const { children } = props;

  return <div className={css.valueContainer}>{children}</div>;
};

ValueContainer.displayName = NAME;

ValueContainer.propTypes = {
  children: PropTypes.node
};

export default ValueContainer;
