import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Paper } from "@material-ui/core";
import clsx from "clsx";

import styles from "../styles.css";

const TabPanel = ({ tab, index, children }) => {
  const css = makeStyles(styles)();

  return (
    <Paper
      elevation={3}
      className={clsx(css.hideTab, css.tabContainer, {
        [css.showTab]: tab === index
      })}
    >
      {children}
    </Paper>
  );
};

TabPanel.displayName = "TabPanel";

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.string,
  tab: PropTypes.string
};

export default TabPanel;
