import React from "react";
import PropTypes from "prop-types";
import { MenuItem } from "@material-ui/core";

import DisableOffline from "../../../disable-offline";
import { ConditionalWrapper } from "../../../../libs";

const Component = ({ actions, disabledCondtion }) =>
  actions.map(action => {
    const { id, disableOffline, name, action: handleAction } = action;

    return (
      <ConditionalWrapper condition={disableOffline} wrapper={DisableOffline} button key={name}>
        <MenuItem disabled={disabledCondtion(action)} onClick={() => handleAction(id)}>
          {action.name}
        </MenuItem>
      </ConditionalWrapper>
    );
  });

Component.defaultProps = {
  disabledCondtion: () => {}
};

Component.propTypes = {
  disabledCondtion: PropTypes.func,
  handleClick: PropTypes.func.isRequired
};

export default Component;
