import React from "react";
import { Drawer, Box } from "@material-ui/core";
import PropTypes from "prop-types";

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

FilterContainer.propTypes = {
  children: PropTypes.node.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  drawer: PropTypes.bool.isRequired,
  handleDrawer: PropTypes.func.isRequired
};

export default FilterContainer;
