import PropTypes from "prop-types";
import { MenuItem } from "@material-ui/core";
import { forwardRef } from "react";

import DisableOffline from "../../../disable-offline";
import { ConditionalWrapper } from "../../../../libs";

const Component = forwardRef(({ action, disabledCondition, handleClose }, ref) => {
  const { id, disableOffline, name, action: handleAction } = action;

  const handleClick = () => {
    handleClose();
    handleAction(id);
  };

  return (
    <ConditionalWrapper condition={disableOffline} wrapper={DisableOffline} button>
      <MenuItem disabled={disabledCondition(action)} onClick={handleClick} ref={ref}>
        {name}
      </MenuItem>
    </ConditionalWrapper>
  );
});

Component.displayName = "MenuItem";

Component.defaultProps = {
  action: {}
};

Component.propTypes = {
  action: PropTypes.object,
  disabledCondition: PropTypes.func,
  handleClose: PropTypes.func
};

export default Component;
