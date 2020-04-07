import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";

import { getPermissionsByRecord } from "../../../../user/selectors";
import { ACTION_BUTTONS_NAME } from "../constants";
import { useI18n } from "../../../../i18n";
import { getSavingRecord } from "../selectors";
import { ActionsMenu, FormAction } from "../../../../form";
import bindFormSubmit from "../../../../../libs/submit-form";
import Permission from "../../../../application/permission";
import {
  RESOURCES,
  ACTIONS,
  WRITE_RECORDS,
  checkPermissions
} from "../../../../../libs/permissions";
import { compare } from "../../../../../libs";

const Component = ({
  formMode,
  formRef,
  handleCancel,
  setOpenDeleteDialog
}) => {
  const i18n = useI18n();
  const { pathname } = useLocation();
  const saving = useSelector(state => getSavingRecord(state));
  const rolePermissions = useSelector(
    state => getPermissionsByRecord(state, RESOURCES.roles),
    compare
  );
  const saveButton = (formMode.get("isEdit") || formMode.get("isNew")) && (
    <>
      <FormAction
        cancel
        actionHandler={handleCancel}
        text={i18n.t("buttons.cancel")}
      />
      <FormAction
        actionHandler={() => bindFormSubmit(formRef)}
        text={i18n.t("buttons.save")}
        savingRecord={saving}
      />
    </>
  );

  const editButton = formMode.get("isShow") && (
    <Permission resources={RESOURCES.roles} actions={WRITE_RECORDS}>
      <Button
        to={`${pathname}/edit`}
        component={Link}
        startIcon={<CreateIcon />}
        size="small"
      >
        {i18n.t("buttons.edit")}
      </Button>
    </Permission>
  );

  const canDeleteRole = checkPermissions(rolePermissions, [
    ACTIONS.MANAGE,
    ACTIONS.DELETE
  ]);

  const actions = [
    {
      name: `${i18n.t("buttons.delete")}`,
      action: () => setOpenDeleteDialog(true),
      condition: canDeleteRole
    }
  ];

  const actionMenu = formMode.get("isShow") && (
    <ActionsMenu actionItems={actions} />
  );

  return (
    <>
      {editButton}
      {saveButton}
      {actionMenu}
    </>
  );
};

Component.displayName = ACTION_BUTTONS_NAME;

Component.propTypes = {
  formMode: PropTypes.object.isRequired,
  formRef: PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  setOpenDeleteDialog: PropTypes.func.isRequired
};

export default Component;
