import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useI18n } from "components/i18n";
import { getPermissionsByRecord } from "components/user/selectors";
import { RECORD_TYPES } from "config";
import * as Permissions from "libs/permissions";
import Permission from "components/application/permission";
import { Notes } from "./notes";
import { Transitions } from "./transitions";
import { fetchTransitionData } from "./transitions/action-creators";
import { ToggleOpen } from "./toggle-open";
import { ToggleEnable } from "./toggle-enable";

const RecordActions = ({ recordType, iconColor, record, mode }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openReopenDialog, setOpenReopenDialog] = useState(false);
  const [openNotesDialog, setOpenNotesDialog] = useState(false);
  const [transitionType, setTransitionType] = useState("");
  const [openEnableDialog, setOpenEnableDialog] = useState(false);

  const enableState =
    record && record.get("record_state") ? "disable" : "enable";

  const openState =
    record && record.get("status") === "open" ? "close" : "reopen";

  const assignPermissions = [
    Permissions.MANAGE,
    Permissions.ASSIGN,
    Permissions.ASSIGN_WITHIN_USER_GROUP,
    Permissions.ASSIGN_WITHIN_AGENCY_PERMISSIONS
  ];

  useEffect(() => {
    dispatch(fetchTransitionData(RECORD_TYPES[recordType]));
  }, [dispatch, recordType]);

  const userPermissions = useSelector(state =>
    getPermissionsByRecord(state, recordType)
  );

  const canAddNotes = Permissions.check(userPermissions, [
    Permissions.MANAGE,
    Permissions.ADD_NOTE
  ]);
  const canReopen = Permissions.check(userPermissions, [
    Permissions.MANAGE,
    Permissions.REOPEN
  ]);

  const canRefer = Permissions.check(userPermissions, [
    Permissions.MANAGE,
    Permissions.REFER
  ]);

  const canClose = Permissions.check(userPermissions, [
    Permissions.MANAGE,
    Permissions.CLOSE
  ]);
  const canEnable = Permissions.check(userPermissions, [
    Permissions.MANAGE,
    Permissions.ENABLE_DISABLE_RECORD
  ]);
  const canTransfer = Permissions.check(userPermissions, assignPermissions);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemAction = itemAction => {
    handleClose();
    itemAction();
  };

  const handleReopenDialogOpen = () => {
    setOpenReopenDialog(true);
  };

  const handleReopenDialogClose = () => {
    setOpenReopenDialog(false);
  };

  const handleEnableDialogOpen = () => {
    setOpenEnableDialog(true);
  };

  const handleEnableDialogClose = () => {
    setOpenEnableDialog(false);
  };

  const transitionsProps = {
    record,
    transitionType,
    setTransitionType,
    recordType,
    userPermissions
  };

  const handleNotesClose = () => {
    setOpenNotesDialog(false);
  };

  const handleNotesOpen = () => {
    setOpenNotesDialog(true);
  };

  const canOpenOrClose =
    (canReopen && openState === "reopen") ||
    (canClose && openState === "close");

  const actions = [
    {
      name: i18n.t("buttons.import"),
      action: () => console.log("Some action"),
      recordType: "all"
    },
    {
      name: i18n.t("exports.custom_exports.label"),
      action: () => console.log("Some action"),
      recordType: "all"
    },
    {
      name: i18n.t("buttons.mark_for_mobile"),
      action: () => console.log("Some action"),
      recordType: "all"
    },
    {
      name: i18n.t("buttons.unmark_for_mobile"),
      action: () => console.log("Some action"),
      recordType: "all"
    },
    {
      name: `${i18n.t("buttons.referral")} ${recordType}`,
      action: () => setTransitionType("referral"),
      recordType,
      condition: canRefer
    },
    {
      name: `${i18n.t("buttons.reassign")} ${recordType}`,
      action: () => setTransitionType("reassign"),
      recordType,
      condition: canTransfer
    },
    {
      name: `${i18n.t("buttons.transfer")} ${recordType}`,
      action: () => setTransitionType("transfer"),
      recordType: ["cases", "incidents"]
    },
    {
      name: i18n.t("actions.incident_details_from_case"),
      action: () => console.log("Some action"),
      recordType: "cases"
    },
    {
      name: i18n.t("actions.services_section_from_case"),
      action: () => console.log("Some action"),
      recordType: "cases"
    },
    {
      name: i18n.t(`actions.${openState}`),
      action: handleReopenDialogOpen,
      recordType: "all",
      condition: mode && mode.isShow && canOpenOrClose
    },
    {
      name: i18n.t(`actions.${enableState}`),
      action: handleEnableDialogOpen,
      recordType: "all",
      condition: mode && mode.isShow && canEnable
    },
    {
      name: i18n.t("actions.notes"),
      action: handleNotesOpen,
      recordType: "all",
      condition: canAddNotes
    }
  ];

  const toggleEnableDialog = (
    <ToggleEnable
      close={handleEnableDialogClose}
      openEnableDialog={openEnableDialog}
      record={record}
      recordType={recordType}
    />
  );

  const toggleOpenDialog = (
    <ToggleOpen
      close={handleReopenDialogClose}
      openReopenDialog={openReopenDialog}
      record={record}
      recordType={recordType}
    />
  );

  return (
    <>
      {mode && mode.isShow ? (
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon color={iconColor} />
        </IconButton>
      ) : null}

      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {actions
          .filter(a => {
            return (
              (a.recordType === "all" ||
                a.recordType === recordType ||
                (Array.isArray(a.recordType) &&
                  a.recordType.includes(recordType))) &&
              (typeof a.condition === "undefined" || a.condition)
            );
          })
          .map(action => (
            <MenuItem
              key={action.name}
              selected={action.name === "Pyxis"}
              onClick={() => handleItemAction(action.action)}
            >
              {action.name}
            </MenuItem>
          ))}
      </Menu>

      {canOpenOrClose ? toggleOpenDialog : null}

      <Permission
        permissionType={recordType}
        permission={[Permissions.MANAGE, Permissions.ENABLE_DISABLE_RECORD]}
      >
        {toggleEnableDialog}
      </Permission>

      <Transitions {...transitionsProps} />

      <Permission
        permissionType={recordType}
        permission={[Permissions.MANAGE, Permissions.ADD_NOTE]}
      >
        <Notes close={handleNotesClose} openNotesDialog={openNotesDialog} />
      </Permission>
    </>
  );
};

RecordActions.propTypes = {
  recordType: PropTypes.string.isRequired,
  iconColor: PropTypes.string,
  record: PropTypes.object,
  mode: PropTypes.object
};

export default RecordActions;
