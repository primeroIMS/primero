import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Menu, MenuItem, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import { push } from "connected-react-router";

import { useThemeHelper } from "../../libs";
import { useI18n } from "../i18n";
import { useApp } from "../application";

import styles from "./styles.css";

const AddRecordMenu = ({ mobileDisplay, recordType }) => {
  const { css } = useThemeHelper(styles);
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const { userModules } = useApp();

  const handleClick = event => {
    const { unique_id: uniqueId } = userModules.first();

    if (userModules.size === 1) {
      dispatch(push(`/${recordType}/${uniqueId}/new`));
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const showNewButton = !mobileDisplay ? i18n.t("buttons.new") : null;

  return (
    <>
      <Button
        onClick={handleClick}
        color="primary"
        className={css.showActionButton}
      >
        <AddIcon />
        {showNewButton}
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {userModules.map(m => (
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
  mobileDisplay: PropTypes.bool,
  recordType: PropTypes.string.isRequired
};

export default AddRecordMenu;
