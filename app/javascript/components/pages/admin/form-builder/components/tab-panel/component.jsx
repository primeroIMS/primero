import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import clsx from "clsx";

import styles from "./styles.css";
import { NAME } from "./constants";

const TabPanel = ({ tab, index, children }) => {
  const css = makeStyles(styles)();
  const className = clsx(css.hideTab, css.tabContainer, {
    [css.showTab]: tab === index
  });

  return (
    <Paper elevation={0} className={className}>
      {children}
    </Paper>
  );
};

TabPanel.displayName = NAME;

TabPanel.whyDidYouRender = true;

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number,
  tab: PropTypes.number
};

export default TabPanel;
