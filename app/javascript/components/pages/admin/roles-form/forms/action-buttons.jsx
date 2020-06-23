import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

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
import { compare, useThemeHelper } from "../../../../../libs";
import styles from "../../styles.css";

const Component = ({
  formMode,
  formRef,
  handleCancel,
  setOpenDeleteDialog
}) => {
  const i18n = useI18n();
  const { pathname } = useLocation();
  const { css, mobileDisplay } = useThemeHelper(styles);

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
        startIcon={<ClearIcon />}
      />
      <FormAction
        actionHandler={() => bindFormSubmit(formRef)}
        text={i18n.t("buttons.save")}
        savingRecord={saving}
        startIcon={<CheckIcon />}
      />
    </>
  );

  const showEditText = !mobileDisplay ? i18n.t("buttons.edit") : null;

  const editButton = formMode.get("isShow") && (
    <Permission resources={RESOURCES.roles} actions={WRITE_RECORDS}>
      <Button
        to={`${pathname}/edit`}
        component={Link}
        size="small"
        className={css.showActionButton}
      >
        <CreateIcon />
        {showEditText}
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
