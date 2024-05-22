// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp, react/display-name */
import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Menu, MenuItem } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import { RECORD_TYPES, RECORD_PATH } from "../../config";
import { useApp } from "../application";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";
import RecordCreationFlow from "../record-creation-flow";
import useMemoizedSelector from "../../libs/use-memoized-selector";
import { getOptionFromAppModule } from "../application/selectors";

import CreateRecordDialog from "./create-record-dialog";
import { SEARCH_AND_CREATE_WORKFLOW } from "./constants";

const AddRecordMenu = ({ recordType }) => {
  const dispatch = useDispatch();
  const [moduleUniqueId, setModuleUniqueId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const { userModules, online } = useApp();

  const searchAndCreateWorkflow = useMemoizedSelector(state =>
    // eslint-disable-next-line camelcase
    getOptionFromAppModule(state, userModules.first()?.unique_id, SEARCH_AND_CREATE_WORKFLOW)
  );

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

  const onClose = () => setModuleUniqueId(null);

  const renderMenu = primeroModules => {
    const handleOnClickMenuItem = primeroModule => () => handleModuleClick(primeroModule);

    return primeroModules?.size > 1 ? (
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {primeroModules.map(primeroModule => {
          return (
            <MenuItem key={primeroModule.unique_id} component={Button} onClick={handleOnClickMenuItem(primeroModule)}>
              {primeroModule.name}
            </MenuItem>
          );
        })}
      </Menu>
    ) : null;
  };

  const renderDialog = uniqueId =>
    uniqueId && <CreateRecordDialog setOpen={setOpen} open={open} recordType={recordType} moduleUniqueId={uniqueId} />;

  const renderCreateRecord =
    searchAndCreateWorkflow && recordType === RECORD_PATH.cases ? (
      <RecordCreationFlow
        open={Boolean(moduleUniqueId)}
        onClose={onClose}
        recordType={recordType}
        // eslint-disable-next-line camelcase
        primeroModule={userModules.first()?.unique_id}
      />
    ) : (
      renderDialog(moduleUniqueId)
    );

  return (
    <>
      <ActionButton
        icon={<AddIcon />}
        text="buttons.new"
        type={ACTION_BUTTON_TYPES.default}
        rest={{ onClick: handleClick }}
      />
      {renderMenu(userModules)}
      {renderCreateRecord}
    </>
  );
};

AddRecordMenu.displayName = "AddRecordMenu";

AddRecordMenu.propTypes = {
  recordType: PropTypes.string.isRequired
};

export default AddRecordMenu;
