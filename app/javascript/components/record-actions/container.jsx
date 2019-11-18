import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { RECORD_TYPES } from "../../config";
import { useI18n } from "../i18n";
import { getPermissionsByRecord } from "../user/selectors";
import {
  PERMISSION_CONSTANTS,
  EXPORT_CUSTOM,
  checkPermissions
} from "../../libs/permissions";
import Permission from "../application/permission";

import { NAME } from "./config";
import { Notes } from "./notes";
import { ToggleEnable } from "./toggle-enable";
import { ToggleOpen } from "./toggle-open";
import { Transitions } from "./transitions";

const Container = ({ recordType, iconColor, record, mode }) => {
  const i18n = useI18n();
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
    PERMISSION_CONSTANTS.MANAGE,
    PERMISSION_CONSTANTS.ASSIGN,
    PERMISSION_CONSTANTS.ASSIGN_WITHIN_USER_GROUP,
    PERMISSION_CONSTANTS.ASSIGN_WITHIN_AGENCY_PERMISSIONS
  ];

  const userPermissions = useSelector(state =>
    getPermissionsByRecord(state, recordType)
  );

  const canAddNotes = checkPermissions(userPermissions, [
    PERMISSION_CONSTANTS.MANAGE,
    PERMISSION_CONSTANTS.ADD_NOTE
  ]);
  const canReopen = checkPermissions(userPermissions, [
    PERMISSION_CONSTANTS.MANAGE,
    PERMISSION_CONSTANTS.REOPEN
  ]);

  const canRefer = checkPermissions(userPermissions, [
    PERMISSION_CONSTANTS.MANAGE,
    PERMISSION_CONSTANTS.REFERRAL
  ]);

  const canClose = checkPermissions(userPermissions, [
    PERMISSION_CONSTANTS.MANAGE,
    PERMISSION_CONSTANTS.CLOSE
  ]);

  const canEnable = checkPermissions(userPermissions, [
    PERMISSION_CONSTANTS.MANAGE,
    PERMISSION_CONSTANTS.ENABLE_DISABLE_RECORD
  ]);

  const canAssign = checkPermissions(userPermissions, assignPermissions);

  const canTransfer = checkPermissions(userPermissions, [
    PERMISSION_CONSTANTS.MANAGE,
    PERMISSION_CONSTANTS.TRANSFER
  ]);

  const canCustomExport = checkPermissions(userPermissions, EXPORT_CUSTOM);

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

  const formRecordType = i18n.t(
    `forms.record_types.${RECORD_TYPES[recordType]}`
  );

  const actions = [
    {
      name: i18n.t("buttons.import"),
      action: () => {
        // eslint-disable-next-line no-console
        console.log("Some action");
      },
      recordType: "all"
    },
    {
      name: i18n.t("exports.custom_exports.label"),
      action: () => {
        // eslint-disable-next-line no-console
        console.log("Some action");
      },
      recordType: "all",
      condition: canCustomExport
    },
    {
      name: i18n.t("buttons.mark_for_mobile"),
      action: () => {
        // eslint-disable-next-line no-console
        console.log("Some action");
      },
      recordType: "all"
    },
    {
      name: i18n.t("buttons.unmark_for_mobile"),
      action: () => {
        // eslint-disable-next-line no-console
        console.log("Some action");
      },
      recordType: "all"
    },
    {
      name: `${i18n.t("buttons.referral")} ${formRecordType}`,
      action: () => setTransitionType("referral"),
      recordType,
      condition: canRefer
    },
    {
      name: `${i18n.t("buttons.reassign")} ${formRecordType}`,
      action: () => setTransitionType("reassign"),
      recordType,
      condition: canAssign
    },
    {
      name: `${i18n.t("buttons.transfer")} ${formRecordType}`,
      action: () => setTransitionType("transfer"),
      recordType: ["cases", "incidents"],
      condition: canTransfer
    },
    {
      name: i18n.t("actions.incident_details_from_case"),
      action: () => {
        // eslint-disable-next-line no-console
        console.log("Some action");
      },
      recordType: "cases"
    },
    {
      name: i18n.t("actions.services_section_from_case"),
      action: () => {
        // eslint-disable-next-line no-console
        console.log("Some action");
      },
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
        permission={[
          PERMISSION_CONSTANTS.MANAGE,
          PERMISSION_CONSTANTS.ENABLE_DISABLE_RECORD
        ]}
      >
        {toggleEnableDialog}
      </Permission>

      <Transitions {...transitionsProps} />

      <Permission
        permissionType={recordType}
        permission={[
          PERMISSION_CONSTANTS.MANAGE,
          PERMISSION_CONSTANTS.ADD_NOTE
        ]}
      >
        <Notes close={handleNotesClose} openNotesDialog={openNotesDialog} />
      </Permission>
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  iconColor: PropTypes.string,
  mode: PropTypes.object,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired
};

export default Container;
