import React from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";

const TabPanel = props => {
  const { children, value, index } = props;

  return (
    <Box
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      role="tabpanel"
    >
      {children}
    </Box>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

export default TabPanel;
