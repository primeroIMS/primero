import React, { useRef, useEffect, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { FormContext, useForm } from "react-hook-form";

import { useI18n } from "../../../i18n";
import { FormAction, whichFormMode, FormSection } from "../../../form";
import { PageHeading, PageContent } from "../../../page";
import LoadingIndicator from "../../../loading-indicator";
import NAMESPACE from "../namespace";
import { ROUTES, SAVE_METHODS } from "../../../../config";
import { usePermissions } from "../../../user";
import { WRITE_RECORDS } from "../../../../libs/permissions";
import { setDialog, setPending } from "../../../record-actions/action-creators";
import { selectDialog, selectDialogPending } from "../../../record-actions/selectors";
import { fetchSystemSettings } from "../../../application";
import bindFormSubmit from "../../../../libs/submit-form";
import { submitHandler } from "../../../form/utils/form-submission";
import CancelPrompt from "../../../form/components/cancel-prompt";

import { form } from "./form";
import validations from "./validations";
import { fetchUser, clearSelectedUser, saveUser } from "./action-creators";
import { USER_CONFIRMATION_DIALOG, PASSWORD_MODAL } from "./constants";
import { getUser, getServerErrors, getIdentityProviders, getSavingRecord } from "./selectors";
import UserConfirmation from "./user-confirmation";
import ChangePassword from "./change-password";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();

  const user = useSelector(state => getUser(state));
  const formErrors = useSelector(state => getServerErrors(state));
  const idp = useSelector(state => getIdentityProviders(state));
  const passwordModal = useSelector(state => selectDialog(state, PASSWORD_MODAL));
  const setPasswordModal = open => {
    dispatch(setDialog({ dialog: PASSWORD_MODAL, open }));
  };
  const dialogPending = useSelector(state => selectDialogPending(state));
  const setDialogPending = pending => {
    dispatch(setPending({ pending }));
  };
  const useIdentityProviders = idp?.get("use_identity_provider");
  const providers = idp?.get("identity_providers");

  const initialValues = user.toJS();
  const validationSchema = validations(formMode, i18n, useIdentityProviders, providers);
  const formMethods = useForm({
    ...(initialValues && { defaultValues: initialValues })
  });

  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");
  const canEditUsers = usePermissions(NAMESPACE, WRITE_RECORDS);
  const [userData, setUserData] = React.useState({});
  const saving = useSelector(state => getSavingRecord(state));

  const userConfirmationOpen = useSelector(state => selectDialog(state, USER_CONFIRMATION_DIALOG));
  const setUserConfirmationOpen = open => {
    dispatch(setDialog({ dialog: USER_CONFIRMATION_DIALOG, open }));
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
        dialogName: USER_CONFIRMATION_DIALOG,
        saveMethod: formMode.get("isEdit") ? SAVE_METHODS.update : SAVE_METHODS.new,
        body: { data },
        message: i18n.t("user.messages.updated"),
        failureMessage: i18n.t("user.messages.failure")
      })
    );
  };

  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };

  const handleCancel = () => {
    dispatch(push(ROUTES.admin_users));
  };

  const onClickChangePassword = () => setPasswordModal(true);

  const saveButton = (formMode.get("isEdit") || formMode.get("isNew")) && (
    <>
      <FormAction cancel actionHandler={handleCancel} text={i18n.t("buttons.cancel")} startIcon={<ClearIcon />} />
      <FormAction
        actionHandler={() => bindFormSubmit(formRef)}
        text={i18n.t("buttons.save")}
        savingRecord={saving}
        startIcon={<CheckIcon />}
      />
    </>
  );

  const editButton = formMode.get("isShow") && (
    <FormAction actionHandler={handleEdit} text={i18n.t("buttons.edit")} startIcon={<CreateIcon />} />
  );

  const pageHeading = user?.size ? `${i18n.t("users.label")} ${user.get("full_name")}` : i18n.t("users.label");

  const identityOptions = providers
    ? providers.toJS().map(provider => {
        return { id: provider.id, display_text: provider.name };
      })
    : [];

  const renderFormSections = () =>
    form(i18n, formMode, useIdentityProviders, providers, identityOptions, onClickChangePassword).map(formSection => (
      <FormSection formSection={formSection} key={formSection.unique_id} />
    ));

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

  useEffect(() => {
    formMethods.reset(initialValues);
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    formErrors?.forEach(error => {
      formMethods.setError(error.get("detail"), "", i18n.t(error.getIn(["message", 0])));
    });
  }, [formErrors]);

  useImperativeHandle(
    formRef,
    submitHandler({
      dispatch,
      formMethods,
      formMode,
      i18n,
      initialValues,
      onSubmit: formMode.get("isEdit") ? handleEditSubmit : handleSubmit
    })
  );

  return (
    <LoadingIndicator hasData={formMode.get("isNew") || user?.size > 0} loading={!user?.size} type={NAMESPACE}>
      <PageHeading title={pageHeading}>
        {canEditUsers && editButton}
        {saveButton}
      </PageHeading>
      <PageContent>
        <FormContext {...formMethods} formMode={formMode}>
          <CancelPrompt useCancelPrompt />
          <form noValidate>{renderFormSections()}</form>
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
          <ChangePassword
            formMode={formMode}
            i18n={i18n}
            open={passwordModal}
            parentFormMethods={formMethods}
            pending={dialogPending}
            setOpen={setPasswordModal}
          />
        </FormContext>
      </PageContent>
    </LoadingIndicator>
  );
};

Container.displayName = "UsersForm";

Container.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Container;
