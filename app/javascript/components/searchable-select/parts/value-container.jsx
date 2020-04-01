import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import styles from "./styles.css";

const ValueContainer = props => {
  const css = makeStyles(styles)();
  const { children } = props;

  return <div className={css.valueContainer}>{children}</div>;
};

ValueContainer.propTypes = {
  children: PropTypes.node,
  selectProps: PropTypes.object.isRequired
};

export default ValueContainer;
