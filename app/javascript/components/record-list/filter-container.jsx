import { Drawer, Hidden } from "@material-ui/core";
import PropTypes from "prop-types";

import { FILTER_CONTAINER_NAME as NAME } from "./constants";
import css from "./styles.css";

const FilterContainer = ({ children, drawer, handleDrawer }) => {
  return (
    <>
      <Hidden mdUp>
        <Drawer anchor="right" open={drawer} onClose={handleDrawer}>
          {children}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <div className={css.filterContainer}>{children}</div>
      </Hidden>
    </>
  );
};

FilterContainer.displayName = NAME;

FilterContainer.propTypes = {
  children: PropTypes.node.isRequired,
  drawer: PropTypes.bool.isRequired,
  handleDrawer: PropTypes.func.isRequired
};

export default FilterContainer;
