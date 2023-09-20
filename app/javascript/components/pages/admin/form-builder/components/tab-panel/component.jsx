import PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
import clsx from "clsx";

import css from "./styles.css";
import { NAME } from "./constants";

const TabPanel = ({ tab, index, children }) => {
  const className = clsx(css.hideTab, css.tabContainer, {
    [css.showTab]: tab === index
  });

  return (
    <Paper elevation={0} className={className} data-testid="tab-panel">
      {children}
    </Paper>
  );
};

TabPanel.displayName = NAME;

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number,
  tab: PropTypes.number
};

export default TabPanel;
