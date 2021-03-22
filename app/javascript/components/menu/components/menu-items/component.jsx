import PropTypes from "prop-types";
import { forwardRef } from "react";

import MenuItem from "../menu-item";

const Component = forwardRef(({ actions, disabledCondtion, handleClose }, ref) => (
  <div>
    {actions.map(action => (
      <MenuItem
        key={action.name}
        action={action}
        disabledCondtion={disabledCondtion}
        handleClose={handleClose}
        ref={ref}
      />
    ))}
  </div>
));

Component.displayName = "MenuItems";

Component.defaultProps = {
  actions: [],
  disabledCondtion: () => {}
};

Component.propTypes = {
  actions: PropTypes.array,
  disabledCondtion: PropTypes.func,
  handleClose: PropTypes.func.isRequired
};

export default Component;
