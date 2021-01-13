import React, { useRef, useEffect, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import CreateIcon from "@material-ui/icons/Create";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import { push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useI18n } from "../../i18n";
import { FormAction, whichFormMode, FormSection } from "../../form";
import PageContainer, { PageHeading, PageContent } from "../../page";
import { ROUTES } from "../../../config";
import bindFormSubmit from "../../../libs/submit-form";
import { form } from "../admin/users-form/form";
import LoadingIndicator from "../../loading-indicator";
import { getIdentityProviders } from "../admin/users-form/selectors";
import validations from "../admin/users-form/validations";
import { getUser, getUserSavingRecord, getServerErrors } from "../../user/selectors";
import { useDialog } from "../../action-dialog";
import ChangePassword from "../admin/users-form/change-password";
import CancelPrompt from "../../form/components/cancel-prompt";
import { PASSWORD_MODAL } from "../admin/users-form/constants";
import { submitHandler } from "../../form/utils/form-submission";

import { NAME } from "./constants";
import NAMESPACE from "./namespace";
import { fetchCurrentUser, clearCurrentUser, updateUserAccount } from "./action-creators";

const Container = ({ mode }) => {
  const i18n = useI18n();
  const formMode = whichFormMode(mode);
  const formRef = useRef();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { setDialog, pending, dialogOpen, dialogClose } = useDialog(PASSWORD_MODAL);

  const currentUser = useSelector(state => getUser(state));
  const saving = useSelector(state => getUserSavingRecord(state));
  const formErrors = useSelector(state => getServerErrors(state));
  const idp = useSelector(state => getIdentityProviders(state));

  const setPasswordModal = () => {
    setDialog({ dialog: PASSWORD_MODAL, open: true });
  };

  const useIdentityProviders = idp?.get("use_identity_provider");
  const providers = idp?.get("identity_providers");

  const identityOptions = providers
    ? providers.toJS().map(provider => {
        return { id: provider.id, display_text: provider.name };
      })
    : [];

  const validationSchema = validations(formMode, i18n, useIdentityProviders, providers, true);
  const initialValues = currentUser.toJS();
  const formMethods = useForm({
    ...(initialValues && { defaultValues: initialValues }),
    ...(validationSchema && { resolver: yupResolver(validationSchema) })
  });
  const handleSubmit = data => dispatch(updateUserAccount({ id, data, message: i18n.t("user.messages.updated") }));

  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };

  const handleCancel = () => {
    dispatch(push(`${ROUTES.account}/${currentUser.get("id")}`));
  };

  const saveButton = formMode.get("isEdit") && (
    <>
      <FormAction cancel actionHandler={handleCancel} text={i18n.t("buttons.cancel")} startIcon={<ClearIcon />} />
      <FormAction
        actionHandler={() => bindFormSubmit(formRef)}
        text={i18n.t("buttons.save")}
        startIcon={<CheckIcon />}
        savingRecord={saving}
      />
    </>
  );

  const editButton = formMode.get("isShow") && (
    <FormAction actionHandler={handleEdit} text={i18n.t("buttons.edit")} startIcon={<CreateIcon />} />
  );

  const pageHeading = currentUser?.size ? currentUser.get("full_name") : i18n.t("navigation.my_account");

  useEffect(() => {
    dispatch(fetchCurrentUser(id));

    return () => {
      dispatch(clearCurrentUser());
    };
  }, [id]);

  useEffect(() => {
    formMethods.reset(initialValues);
  }, [currentUser]);

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
      onSubmit: handleSubmit
    })
  );

  const onClickChangePassword = () => setPasswordModal(true);

  const renderFormSections = () =>
    form(
      i18n,
      formMode,
      useIdentityProviders,
      providers,
      identityOptions,
      onClickChangePassword,
      true
    ).map(formSection => <FormSection formSection={formSection} key={formSection.unique_id} />);

  return (
    <LoadingIndicator hasData={currentUser.size > 0} loading={!currentUser.size} type={NAMESPACE}>
      <PageContainer>
        <PageHeading title={pageHeading}>
          {editButton}
          {saveButton}
        </PageHeading>
        <PageContent>
          <FormProvider {...formMethods} formMode={formMode}>
            <CancelPrompt useCancelPrompt />
            <form noValidate>{renderFormSections()}</form>
            <ChangePassword
              formMode={formMode}
              i18n={i18n}
              open={dialogOpen}
              parentFormMethods={formMethods}
              pending={pending}
              close={dialogClose}
            />
          </FormProvider>
        </PageContent>
      </PageContainer>
    </LoadingIndicator>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Container;
