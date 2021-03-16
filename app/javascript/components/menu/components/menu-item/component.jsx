import PropTypes from "prop-types";
import { MenuItem } from "@material-ui/core";

import DisableOffline from "../../../disable-offline";
import { ConditionalWrapper } from "../../../../libs";

const Component = ({ action, disabledCondtion, handleClose }) => {
  const { id, disableOffline, name, action: handleAction } = action;

  const handleClick = () => {
    handleClose();
    handleAction(id);
  };

  return (
    <ConditionalWrapper condition={disableOffline} wrapper={DisableOffline} button>
      <MenuItem disabled={disabledCondtion(action)} onClick={handleClick}>
        {name}
      </MenuItem>
    </ConditionalWrapper>
  );
};

Component.displayName = "MenuItem";

Component.defaultProps = {
  action: {}
};

Component.propTypes = {
  action: PropTypes.object,
  disabledCondtion: PropTypes.func,
  handleClose: PropTypes.func
};

export default Component;
