/* eslint-disable react/no-multi-comp, react/display-name */
import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Menu, MenuItem } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import { RECORD_TYPES } from "../../config";
import { useI18n } from "../i18n";
import { useApp } from "../application";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";

import CreateRecordDialog from "./create-record-dialog";

const AddRecordMenu = ({ recordType }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [moduleUniqueId, setModuleUniqueId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const { userModules, online } = useApp();

  const showDialogOrRedirectNew = primeroModule => {
    const { unique_id: uniqueId, options } = primeroModule;

    if (online && options.allow_searchable_ids && RECORD_TYPES.cases === RECORD_TYPES[recordType]) {
      setModuleUniqueId(uniqueId);
      setOpen(true);
    } else {
      dispatch(push(`/${recordType}/${uniqueId}/new`));
    }
  };

  const handleClick = event => {
    if (userModules.size === 1) {
      showDialogOrRedirectNew(userModules.first());
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleModuleClick = primeroModule => {
    setAnchorEl(null);
    showDialogOrRedirectNew(primeroModule);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = primeroModules =>
    primeroModules?.size > 1 ? (
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {primeroModules.map(primeroModule => (
          <MenuItem key={primeroModule.unique_id} component={Button} onClick={() => handleModuleClick(primeroModule)}>
            {primeroModule.name}
          </MenuItem>
        ))}
      </Menu>
    ) : null;

  const renderDialog = uniqueId =>
    uniqueId && <CreateRecordDialog setOpen={setOpen} open={open} recordType={recordType} moduleUniqueId={uniqueId} />;

  return (
    <>
      <ActionButton
        icon={<AddIcon />}
        text={i18n.t("buttons.new")}
        type={ACTION_BUTTON_TYPES.default}
        rest={{ onClick: handleClick }}
      />
      {renderMenu(userModules)}
      {renderDialog(moduleUniqueId)}
    </>
  );
};

AddRecordMenu.displayName = "AddRecordMenu";

AddRecordMenu.propTypes = {
  recordType: PropTypes.string.isRequired
};

export default AddRecordMenu;
