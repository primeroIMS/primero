// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Drawer } from "@mui/material";
import PropTypes from "prop-types";

import { useDrawer } from "../../../drawer";

import { FILTER_DRAWER, NAME } from "./constants";
import css from "./styles.css";

function FilterContainer({ children, mobileDisplay, noMargin, drawerName = FILTER_DRAWER }) {
  const { drawerOpen, toggleDrawer } = useDrawer(drawerName);

  if (mobileDisplay) {
    return (
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        {children}
      </Drawer>
    );
  }

  return <div className={noMargin || css.filterContainer}>{children}</div>;
}

FilterContainer.displayName = NAME;

FilterContainer.propTypes = {
  children: PropTypes.node.isRequired,
  drawerName: PropTypes.string,
  mobileDisplay: PropTypes.bool.isRequired,
  noMargin: PropTypes.bool
};

export default FilterContainer;
