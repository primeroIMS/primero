// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Button, Menu, MenuItem } from "@mui/material";

function Component({ anchorEl, handleClose, handleModuleClick, primeroModules }) {
  return (
    <Menu data-testid="menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
      {primeroModules.map(primeroModule => {
        return (
          <MenuItem key={primeroModule.unique_id} component={Button} onClick={() => handleModuleClick(primeroModule)}>
            {primeroModule.name}
          </MenuItem>
        );
      })}
    </Menu>
  );
}

Component.displayName = "ModuleMenu";

Component.propTypes = {
  anchorEl: PropTypes.object,
  handleClose: PropTypes.func,
  handleModuleClick: PropTypes.func,
  primeroModules: PropTypes.arrayOf(PropTypes.object)
};

export default Component;
