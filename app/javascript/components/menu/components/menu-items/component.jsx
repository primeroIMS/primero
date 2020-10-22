import React from "react";
import PropTypes from "prop-types";
import { MenuItem } from "@material-ui/core";

import DisableOffline from "../../../disable-offline";
import { ConditionalWrapper } from "../../../../libs";

const Component = ({ actions, disabledCondtion, handleClose }) => {
  // eslint-disable-next-line react/display-name
  const renderItem = action => {
    const { id, disableOffline, name, action: handleAction } = action;
    const handleClick = () => {
      handleClose();
      handleAction(id);
    };

    return (
      <ConditionalWrapper condition={disableOffline} wrapper={DisableOffline} button key={name}>
        <MenuItem disabled={disabledCondtion(action)} onClick={handleClick}>
          {action.name}
        </MenuItem>
      </ConditionalWrapper>
    );
  };

  return actions.map(renderItem);
};

Component.defaultProps = {
  disabledCondtion: () => {}
};

Component.propTypes = {
  disabledCondtion: PropTypes.func,
  handleClose: PropTypes.func.isRequired
};

export default Component;
