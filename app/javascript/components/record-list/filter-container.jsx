import React from "react";
import { Drawer, Box } from "@material-ui/core";
import PropTypes from "prop-types";

import { FILTER_CONTAINER_NAME as NAME } from "./constants";

const FilterContainer = ({ children, mobileDisplay, drawer, handleDrawer }) => {
  if (mobileDisplay) {
    return (
      <Drawer anchor="right" open={drawer} onClose={handleDrawer}>
        {children}
      </Drawer>
    );
  }

  return <Box mx={2}>{children}</Box>;
};

FilterContainer.displayName = NAME;

FilterContainer.propTypes = {
  children: PropTypes.node.isRequired,
  drawer: PropTypes.bool.isRequired,
  handleDrawer: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired
};

export default FilterContainer;
