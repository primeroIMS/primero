/* eslint-disable react/no-multi-comp */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { batch, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { useI18n } from "../../../i18n";
import { FormAction, FormSection, submitHandler, whichFormMode } from "../../../form";
import { PageHeading, PageContent } from "../../../page";
import LoadingIndicator from "../../../loading-indicator";
import NAMESPACE from "../namespace";
import { ROUTES, SAVE_METHODS } from "../../../../config";
import { usePermissions } from "../../../user";
import { WRITE_RECORDS, ACTIONS } from "../../../../libs/permissions";
import { useDialog } from "../../../action-dialog";
import { fetchSystemSettings, fetchRoles, fetchUserGroups } from "../../../application";
import CancelPrompt from "../../../form/components/cancel-prompt";
import { currentUser, getCurrentUserGroupPermission } from "../../../user/selectors";
import UserActions from "../../../user-actions";
import { useMemoizedSelector } from "../../../../libs";

import { form } from "./form";
import validations from "./validations";
import { fetchUser, clearSelectedUser, saveUser } from "./action-creators";
import { USER_CONFIRMATION_DIALOG, PASSWORD_MODAL, FORM_ID } from "./constants";
import { getUser, getServerErrors, getIdentityProviders, getSavingRecord } from "./selectors";
import UserConfirmation from "./user-confirmation";
import ChangePassword from "./change-password";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);

  const i18n = useI18n();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { dialogOpen, dialogClose, pending, setDialogPending, setDialog } = useDialog([
    PASSWORD_MODAL,
    USER_CONFIRMATION_DIALOG
  ]);

  const agencyReadOnUsers = usePermissions(NAMESPACE, [ACTIONS.AGENCY_READ]);

  const user = useMemoizedSelector(state => getUser(state));
  const formErrors = useMemoizedSelector(state => getServerErrors(state));
  const idp = useMemoizedSelector(state => getIdentityProviders(state));
  const currentUserName = useMemoizedSelector(state => currentUser(state));
  const saving = useMemoizedSelector(state => getSavingRecord(state));
  const currentRoleGroupPermission = useMemoizedSelector(state => getCurrentUserGroupPermission(state));

  const setPasswordModal = () => {
    setDialog({ dialog: PASSWORD_MODAL, open: true });
  };

  const setUserConfirmationOpen = () => {
    setDialog({ dialog: USER_CONFIRMATION_DIALOG, open: true });
  };

  const useIdentityProviders = idp?.get("use_identity_provider");
  const providers = idp?.get("identity_providers");
  const selectedUserName = user.get("user_name");
  const selectedUserIsLoggedIn = currentUserName === selectedUserName;

  const initialValues = user.toJS();

  const validationSchema = validations(formMode, i18n, useIdentityProviders, providers, selectedUserIsLoggedIn);

  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");
  const canEditUsers = usePermissions(NAMESPACE, WRITE_RECORDS);
  const [userData, setUserData] = useState({});

  const handleSubmit = data => {
    setUserData({ ...userData, ...data });
    setUserConfirmationOpen(true);
  };

  const handleEditSubmit = data => {
    dispatch(
      saveUser({
        id,
        dialogName: USER_CONFIRMATION_DIALOG,
        saveMethod: formMode.get("isEdit") ? SAVE_METHODS.update : SAVE_METHODS.new,
        body: { data },
        message: i18n.t("user.messages.updated")
      })
    );
  };

  const formMethods = useForm({
    ...(initialValues && { defaultValues: initialValues }),
    ...(validationSchema && { resolver: yupResolver(validationSchema) })
  });

  const {
    formState: { dirtyFields }
  } = formMethods;

  const onSubmit = data => {
    submitHandler({
      data,
      dispatch,
      isEdit: formMode.isEdit,
      initialValues,
      dirtyFields,
      onSubmit: formData => (formMode.get("isEdit") ? handleEditSubmit(formData) : handleSubmit(formData))
    });
  };

  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };

  const handleCancel = () => {
    dispatch(push(ROUTES.admin_users));
  };

  const onClickChangePassword = () => setPasswordModal(true);

  useEffect(() => {
    if (!saving) {
      setDialogPending(false);
    }
  }, [saving]);

  const saveButton = (formMode.get("isEdit") || formMode.get("isNew")) && (
    <>
      <FormAction cancel actionHandler={handleCancel} text={i18n.t("buttons.cancel")} startIcon={<ClearIcon />} />
      <FormAction
        options={{
          form: FORM_ID,
          type: "submit"
        }}
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
    ? providers.reduce(
        (prev, current) => [...prev, { id: current.get("unique_id"), display_text: current.get("name") }],
        []
      )
    : [];

  const renderFormSections = () =>
    form(
      i18n,
      formMode,
      useIdentityProviders,
      providers,
      identityOptions,
      onClickChangePassword,
      selectedUserIsLoggedIn,
      {
        agencyReadOnUsers,
        currentRoleGroupPermission
      }
    ).map(formSection => (
      <FormSection
        formSection={formSection}
        key={formSection.unique_id}
        formMethods={formMethods}
        formMode={formMode}
      />
    ));

  useEffect(() => {
    batch(() => {
      dispatch(fetchSystemSettings());
      dispatch(fetchRoles());
      dispatch(fetchUserGroups());
    });
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

  return (
    <LoadingIndicator hasData={formMode.get("isNew") || user?.size > 0} loading={!user?.size} type={NAMESPACE}>
      <PageHeading title={pageHeading}>
        {canEditUsers && editButton}
        {saveButton}
        {formMode.get("isShow") && id && <UserActions id={id} />}
      </PageHeading>
      <PageContent>
        <>
          <CancelPrompt useCancelPrompt isShow={formMode.get("isShow")} formState={formMethods.formState} />
          <form noValidate id={FORM_ID} onSubmit={formMethods.handleSubmit(onSubmit)}>
            {renderFormSections()}
          </form>
          <UserConfirmation
            open={dialogOpen[USER_CONFIRMATION_DIALOG]}
            close={dialogClose}
            saveMethod={formMode.get("isEdit") ? "update" : "new"}
            pending={pending}
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
            open={dialogOpen[PASSWORD_MODAL]}
            parentFormMethods={formMethods}
            pending={pending}
            close={dialogClose}
          />
        </>
      </PageContent>
    </LoadingIndicator>
  );
};

Container.displayName = "UsersForm";

Container.whyDidYouRender = true;

Container.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Container;
