import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { useParams } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";
import { Typography, Tooltip } from "@material-ui/core";

import { useI18n } from "../../../i18n";
import Form, { FormAction, whichFormMode } from "../../../form";
import { PageHeading, PageContent } from "../../../page";
import LoadingIndicator from "../../../loading-indicator";
import NAMESPACE from "../user-groups-list/namespace";
import { ROUTES, SAVE_METHODS } from "../../../../config";
import bindFormSubmit from "../../../../libs/submit-form";
import ActionDialog from "../../../action-dialog";
import { selectDialog, selectDialogPending } from "../../../record-actions/selectors";
import { setDialog, setPending } from "../../../record-actions/action-creators";

import { form, validations } from "./form";
import {
  fetchConfiguration,
  clearSelectedConfiguration,
  saveConfiguration,
  deleteConfiguration
} from "./action-creators";
import { getConfiguration, getServerErrors, getSavingRecord } from "./selectors";
import { NAME, DELETE_CONFIGURATION_MODAL } from "./constants";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");
  const configuration = useSelector(state => getConfiguration(state));
  const saving = useSelector(state => getSavingRecord(state));
  const formErrors = useSelector(state => getServerErrors(state));
  const validationSchema = validations(formMode, i18n);

  const deleteModal = useSelector(state => selectDialog(state, DELETE_CONFIGURATION_MODAL));
  const setDeleteModal = open => {
    dispatch(setDialog({ dialog: DELETE_CONFIGURATION_MODAL, open }));
  };
  const dialogPending = useSelector(state => selectDialogPending(state));
  const setDialogPending = pending => {
    dispatch(setPending({ pending }));
  };

  const handleSubmit = data => {
    dispatch(
      saveConfiguration({
        id,
        body: { data },
        saveMethod: formMode.get("isEdit") ? SAVE_METHODS.update : SAVE_METHODS.new,
        message: i18n.t(`configurations.messages.${formMode.get("isEdit") ? "updated" : "created"}`)
      })
    );
  };

  const handleCancel = () => dispatch(push(ROUTES.configurations));

  const handleApply = () => handleCancel();

  const handleSuccessDelete = () => {
    setDialogPending(true);

    dispatch(
      deleteConfiguration({
        id,
        message: i18n.t("configurations.messages.deleted")
      })
    );
  };

  const handleCancelDelete = () => setDeleteModal(false);

  const handleDelete = () => setDeleteModal(true);

  useEffect(() => {
    if (isEditOrShow) {
      dispatch(fetchConfiguration(id));
    }

    return () => {
      if (isEditOrShow) {
        dispatch(clearSelectedConfiguration());
      }
    };
  }, [id]);

  const pageHeading = configuration?.size ? configuration.get("name") : i18n.t("configurations.label_new");

  const editButton = formMode.get("isShow") ? (
    <>
      <FormAction actionHandler={handleDelete} text={i18n.t("buttons.delete")} startIcon={<DeleteIcon />} />
      <Tooltip title={i18n.t("configurations.not_allowed")}>
        <span>
          <FormAction actionHandler={handleApply} text={i18n.t("buttons.apply")} startIcon={<CheckIcon />} disabled />
        </span>
      </Tooltip>
    </>
  ) : null;

  const saveButton =
    formMode.get("isEdit") || formMode.get("isNew") ? (
      <>
        <FormAction
          actionHandler={() => bindFormSubmit(formRef)}
          text={i18n.t("buttons.save")}
          savingRecord={saving}
          startIcon={<CheckIcon />}
        />
      </>
    ) : null;

  return (
    <LoadingIndicator
      hasData={formMode.get("isNew") || configuration?.size > 0}
      loading={!configuration?.size}
      type={NAMESPACE}
    >
      <PageHeading title={pageHeading}>
        {editButton}
        {saveButton}
      </PageHeading>
      <PageContent>
        <Typography component="h5" color="textSecondary">
          {i18n.t("configurations.explanation")}
        </Typography>
        <br />
        <Form
          useCancelPrompt
          mode={mode}
          formSections={form(i18n, formMode.get("isShow"))}
          onSubmit={handleSubmit}
          ref={formRef}
          validations={validationSchema}
          initialValues={configuration.toJS()}
          formErrors={formErrors}
        />
        <ActionDialog
          open={deleteModal}
          successHandler={handleSuccessDelete}
          cancelHandler={handleCancelDelete}
          dialogTitle={i18n.t("fields.remove")}
          dialogText={i18n.t("configurations.delete_label")}
          confirmButtonLabel={i18n.t("buttons.delete")}
          pending={dialogPending}
          omitCloseAfterSuccess
        />
      </PageContent>
    </LoadingIndicator>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Container;
