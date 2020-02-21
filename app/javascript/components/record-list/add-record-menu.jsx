import React, { useState } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem, IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";

import { useApp } from "../application";

const AddRecordMenu = ({ recordType }) => {
  const { modules } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick} color="primary">
        <AddIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {modules.map(m => (
          <MenuItem
            key={m.unique_id}
            component={Link}
            to={`/${recordType}/${m.unique_id}/new`}
          >
            {m.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

AddRecordMenu.displayName = "AddRecordMenu";

AddRecordMenu.propTypes = {
  recordType: PropTypes.string.isRequired
};

export default AddRecordMenu;
