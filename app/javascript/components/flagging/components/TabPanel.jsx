// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Box } from "@mui/material";

function TabPanel(props) {
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
}

TabPanel.displayName = "TabPanel";

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

export default TabPanel;
