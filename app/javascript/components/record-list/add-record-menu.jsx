// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import { RECORD_TYPES } from "../../config";
import { useApp } from "../application";
import ActionButton from "../action-button";
import { ACTION_BUTTON_TYPES } from "../action-button/constants";

import SearchCreateWorkflow from "./search-create-workflow";
import ModuleMenu from "./module-menu";

function AddRecordMenu({ recordType }) {
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

  const handleModuleClick = useCallback(primeroModule => {
    setAnchorEl(null);
    showDialogOrRedirectNew(primeroModule);
  }, []);

  const handleClose = useCallback(() => setAnchorEl(null), []);

  const onClose = () => setModuleUniqueId(null);

  return (
    <>
      <ActionButton
        icon={<AddIcon />}
        text="buttons.new"
        type={ACTION_BUTTON_TYPES.default}
        rest={{ onClick: handleClick }}
      />
      {userModules?.size > 1 && (
        <ModuleMenu
          anchorEl={anchorEl}
          handleClose={handleClose}
          handleModuleClick={handleModuleClick}
          primeroModules={userModules}
        />
      )}
      {moduleUniqueId && (
        <SearchCreateWorkflow
          open={open}
          onClose={onClose}
          primeroModuleUniqueId={moduleUniqueId}
          recordType={recordType}
          setOpen={setOpen}
        />
      )}
    </>
  );
}

AddRecordMenu.displayName = "AddRecordMenu";

AddRecordMenu.propTypes = {
  recordType: PropTypes.string.isRequired
};

export default AddRecordMenu;
