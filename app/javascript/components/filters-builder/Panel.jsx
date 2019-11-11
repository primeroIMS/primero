import React, { useState } from "react";
import PropTypes from "prop-types";
import { ExpansionPanel } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import styles from "./styles.css";

const Panel = ({ children, hasValues }) => {
  const css = makeStyles(styles)();
  const [expanded, setExpanded] = useState(hasValues || false);

  const handleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <ExpansionPanel
      expanded={expanded}
      onChange={handleExpanded}
      className={css.panel}
    >
      {children}
    </ExpansionPanel>
  );
};

Panel.displayName = "Panel";

Panel.propTypes = {
  children: PropTypes.node.isRequired,
  hasValues: PropTypes.bool
};

export default Panel;
