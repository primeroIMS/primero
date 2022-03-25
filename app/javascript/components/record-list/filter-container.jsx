import { Drawer } from "@material-ui/core";
import PropTypes from "prop-types";

import { FILTER_CONTAINER_NAME as NAME } from "./constants";
import css from "./styles.css";

const FilterContainer = ({ children, mobileDisplay, drawer, handleDrawer }) => {
  if (mobileDisplay) {
    return (
      <Drawer anchor="right" open={drawer} onClose={handleDrawer}>
        {children}
      </Drawer>
    );
  }

  return (
    <div className={css.filterContainer} mx={2}>
      {children}
    </div>
  );
};

FilterContainer.displayName = NAME;

FilterContainer.propTypes = {
  children: PropTypes.node.isRequired,
  drawer: PropTypes.bool.isRequired,
  handleDrawer: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired
};

export default FilterContainer;
