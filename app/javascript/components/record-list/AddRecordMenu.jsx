import React, { useState } from "react";
import PropTypes from "prop-types";
import { Menu, MenuItem, IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";

// TODO: Will have to get list from endpoint
const primeroModules = [
  { id: "primeromodule-cp", display_text: "CP" },
  { id: "primeromodule-gbv", display_text: "GBV" },
  { id: "primeromodule-mrm", display_text: "MRM" }
];

const AddRecordMenu = ({ recordType }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <AddIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {primeroModules.map(m => (
          <MenuItem
            key={m.id}
            component={Link}
            to={`/${recordType}/${m.id}/new`}
          >
            {m.display_text}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

AddRecordMenu.propTypes = {
  recordType: PropTypes.string.isRequired
};

export default AddRecordMenu;
