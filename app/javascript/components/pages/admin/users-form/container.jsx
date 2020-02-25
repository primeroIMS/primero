import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";

import { useI18n } from "../../../i18n";
import Form, { FormAction, whichFormMode } from "../../../form";
import { PageHeading, PageContent } from "../../../page";
import { LoadingIndicator } from "../../../loading-indicator";
import NAMESPACE from "../namespace";
import { ROUTES } from "../../../../config";
import { usePermissions } from "../../../user";
import { WRITE_RECORDS } from "../../../../libs/permissions";
import { setDialog, setPending } from "../../../record-actions/action-creators";
import { selectDialog, selectDialogPending } from "../../../record-actions/selectors";
import { fetchSystemSettings } from "../../../application";

import { form, validations } from "./form";
import { fetchUser, clearSelectedUser, saveUser } from "./action-creators";
import { USER_CONFIRMATION_DIALOG } from "./constants";
import { getUser, getServerErrors, selectIdentityProviders } from "./selectors";
import UserConfirmation from "./user-confirmation";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const user = useSelector(state => getUser(state));
  const formErrors = useSelector(state => getServerErrors(state));
  const idp = useSelector(state => selectIdentityProviders(state));
  const useIdentityProviders = idp?.get("use_identity_provider");
  const providers = idp?.get("identity_providers");
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");
  const validationSchema = validations(formMode, i18n, useIdentityProviders, providers);
  const canEditUsers = usePermissions(NAMESPACE, WRITE_RECORDS);
  const [userData, setUserData] = React.useState({});

  const userConfirmationOpen = useSelector(state =>
    selectDialog(USER_CONFIRMATION_DIALOG, state)
  );
  const setUserConfirmationOpen = open => {
    dispatch(setDialog({ dialog: USER_CONFIRMATION_DIALOG, open: open }));
  };
  const dialogPending = useSelector(state => selectDialogPending(state));
  const setDialogPending = pending => {
    dispatch(setPending({ pending: pending }));
  };

  const handleClose = () => {
    setUserConfirmationOpen(false);
  };

  const handleSubmit = data => {
    setUserData(data);
    setUserConfirmationOpen(true);
  };

  const handleEditSubmit = data => {
    dispatch(
      saveUser({
        id,
        saveMethod: formMode.get("isEdit") ? "update" : "new",
        dialogName: USER_CONFIRMATION_DIALOG,
        body: { data },
        message: i18n.t("user.messages.updated"),
        failureMessage: i18n.t("user.messages.failure")
      })
    );
   };

  const bindFormSubmit = () => {
    formRef.current.submitForm();
  };

  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };

  const handleCancel = () => {
    dispatch(push(ROUTES.admin_users));
  };

  useEffect(() => {
    dispatch(fetchSystemSettings());
  }, []);

  useEffect(() => {
    if (isEditOrShow) {
      dispatch(fetchUser(id));
    }

    return () => {
      if (isEditOrShow) {
        dispatch(clearSelectedUser());
      }
    };
  }, [id]);

  const saveButton = (formMode.get("isEdit") || formMode.get("isNew")) && (
    <>
      <FormAction
        cancel
        actionHandler={handleCancel}
        text={i18n.t("buttons.cancel")}
      />
      <FormAction
        actionHandler={bindFormSubmit}
        text={i18n.t("buttons.save")}
      />
    </>
  );

  const editButton = formMode.get("isShow") && (
    <FormAction actionHandler={handleEdit} text={i18n.t("buttons.edit")} />
  );

  const pageHeading = user?.size
    ? `${i18n.t("users.label")} ${user.get("full_name")}`
    : i18n.t("users.label");

  const identityOptions = providers ? providers.toJS().map(provider => {
    return { id: provider.id, display_text: provider.name };
  }) : [];

  return (
    <LoadingIndicator
      hasData={formMode.get("isNew") || user?.size > 0}
      type={NAMESPACE}
    >
      <PageHeading title={pageHeading}>
        {canEditUsers && editButton}
        {saveButton}
      </PageHeading>
      <PageContent>
        <Form
          useCancelPrompt
          mode={mode}
          formSections={form(
            i18n,
            formMode,
            useIdentityProviders,
            providers,
            identityOptions
          )}
          onSubmit={formMode.get("isEdit") ? handleEditSubmit : handleSubmit}
          ref={formRef}
          validations={validationSchema}
          initialValues={user.toJS()}
          formErrors={formErrors}
        />
        <UserConfirmation
          userConfirmationOpen={userConfirmationOpen}
          close={handleClose}
          saveMethod={formMode.get("isEdit") ? "update" : "new"}
          pending={dialogPending}
          setPending={setDialogPending}
          id={id}
          isIdp={useIdentityProviders}
          dialogName={USER_CONFIRMATION_DIALOG}
          userData={userData}
          userName={formMode.get("isEdit") ? user.get("user_name") : userData.user_name}
          identityOptions={identityOptions}
        />
      </PageContent>
    </LoadingIndicator>
  );
};

Container.displayName = "UsersForm";

Container.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Container;
