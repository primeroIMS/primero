import React, { useState } from "react";
import PropTypes from "prop-types";
import { ExpansionPanel } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import styles from "./styles.css";

const Panel = ({ children }) => {
  const css = makeStyles(styles)();
  const [expanded, setExpanded] = useState(false);

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

Panel.propTypes = {
  children: PropTypes.node.isRequired
};

export default Panel;
