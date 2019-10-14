import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useI18n } from "components/i18n";
import { getPermissionsByRecord } from "components/user/selectors";
import { RECORD_TYPES } from "config";
import { Reopen } from "./reopen";
import { CloseCase } from "./close-case";
import { Notes } from "./notes";
import { Transitions } from "./transitions";
import { fetchTransitionData } from "./transitions/action-creators";

const RecordActions = ({ recordType, iconColor, record, mode }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openReopenDialog, setOpenReopenDialog] = useState(false);
  const [openCloseDialog, setOpenCloseDialog] = useState(false);
  const [openNotesDialog, setOpenNotesDialog] = useState(false);
  const [transitionType, setTransitionType] = useState("");
  const assignPermissions = [
    "manage",
    "assign",
    "assign_within_user_group",
    "assign_within_agency permissions"
  ];

  useEffect(() => {
    dispatch(fetchTransitionData(RECORD_TYPES[recordType]));
  }, []);

  const userPermissions = useSelector(state =>
    getPermissionsByRecord(state, recordType)
  );

  const canAddNotes =
    userPermissions &&
    userPermissions.filter(permission => {
      return ["manage", "add_note"].includes(permission);
    }).size > 0;

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

  const handleCloseDialogOpen = () => {
    setOpenCloseDialog(true);
  };

  const handleCloseDialogClose = () => {
    setOpenCloseDialog(false);
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
      recordType
    },
    {
      name: `${i18n.t("buttons.reassign")} ${recordType}`,
      action: () => setTransitionType("reassign"),
      recordType,
      condition:
        userPermissions &&
        userPermissions.filter(permission => {
          return assignPermissions.includes(permission);
        }).size > 0
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
      name: i18n.t("actions.reopen"),
      action: handleReopenDialogOpen,
      recordType: "all",
      condition:
        mode &&
        mode.isShow &&
        typeof record.find((r, index) => {
          return index === "status" && r === "closed";
        }) !== "undefined"
    },
    {
      name: i18n.t("actions.close"),
      action: handleCloseDialogOpen,
      recordType: "all",
      condition:
        mode &&
        mode.isShow &&
        typeof record.find((r, index) => {
          return index === "status" && r === "open";
        }) !== "undefined"
    },
    {
      name: i18n.t("actions.notes"),
      action: handleNotesOpen,
      recordType: "all",
      condition: canAddNotes
    }
  ];

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

      <Reopen
        close={handleReopenDialogClose}
        openReopenDialog={openReopenDialog}
        record={record}
        recordType={recordType}
      />
      <CloseCase
        close={handleCloseDialogClose}
        openCloseCaseDialog={openCloseDialog}
        record={record}
        recordType={recordType}
      />
      <Transitions {...transitionsProps} />

      {canAddNotes ? (
        <Notes close={handleNotesClose} openNotesDialog={openNotesDialog} />
      ) : null}
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
