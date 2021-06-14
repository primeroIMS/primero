/* eslint-disable react/display-name */
import { fromJS } from "immutable";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import CreateIcon from "@material-ui/icons/Create";
import { push } from "connected-react-router";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { batch, useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import { ROUTES } from "../../../config";
import { useMemoizedSelector } from "../../../libs";
import { useDialog } from "../../action-dialog";
import Form, { FormAction, whichFormMode } from "../../form";
import { useI18n } from "../../i18n";
import LoadingIndicator from "../../loading-indicator";
import PageContainer, { PageContent, PageHeading } from "../../page";
import { getServerErrors, getUser, getUserSavingRecord } from "../../user/selectors";
import ChangePassword from "../admin/users-form/change-password";
import { PASSWORD_MODAL } from "../admin/users-form/constants";
import { form } from "../admin/users-form/form";
import { getIdentityProviders } from "../admin/users-form/selectors";
import validations from "../admin/users-form/validations";
import { fetchRoles } from "../../application";

import { clearCurrentUser, fetchCurrentUser, updateUserAccount } from "./action-creators";
import { FORM_ID, NAME } from "./constants";
import NAMESPACE from "./namespace";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);

  const i18n = useI18n();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { setDialog, pending, dialogOpen, dialogClose } = useDialog(PASSWORD_MODAL);

  const currentUser = useMemoizedSelector(state => getUser(state));
  const saving = useMemoizedSelector(state => getUserSavingRecord(state));
  const formErrors = useMemoizedSelector(state => getServerErrors(state));
  const idp = useMemoizedSelector(state => getIdentityProviders(state));

  const setPasswordModal = () => {
    setDialog({ dialog: PASSWORD_MODAL, open: true });
  };

  const useIdentityProviders = idp?.get("use_identity_provider");
  const providers = idp?.get("identity_providers");

  const identityOptions = providers
    ? providers.map(provider => {
        return { id: provider.get("unique_id"), display_text: provider.get("name") };
      })
    : [];

  const validationSchema = validations(formMode, i18n, useIdentityProviders, providers, true);
  const initialValues = currentUser.toJS();

  const handleSubmit = data => {
    dispatch(updateUserAccount({ id, data, message: i18n.t("user.messages.updated") }));
  };

  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };

  const handleCancel = () => {
    dispatch(push(`${ROUTES.account}/${currentUser.get("id")}`));
  };

  const saveButton = formMode.isEdit && (
    <>
      <FormAction cancel actionHandler={handleCancel} text={i18n.t("buttons.cancel")} startIcon={<ClearIcon />} />
      <FormAction
        text={i18n.t("buttons.save")}
        startIcon={<CheckIcon />}
        savingRecord={saving}
        options={{
          form: FORM_ID,
          type: "submit"
        }}
      />
    </>
  );

  const editButton = formMode.isShow && (
    <FormAction actionHandler={handleEdit} text={i18n.t("buttons.edit")} startIcon={<CreateIcon />} />
  );

  const pageHeading = currentUser.get("full_name", "") || i18n.t("navigation.my_account");

  useEffect(() => {
    dispatch(fetchCurrentUser(id));

    return () => {
      dispatch(clearCurrentUser());
    };
  }, [id]);

  useEffect(() => {
    batch(() => {
      dispatch(fetchRoles());
    });
  }, []);

  const onClickChangePassword = () => setPasswordModal(true);

  const formSections = form(
    i18n,
    formMode,
    useIdentityProviders,
    providers,
    identityOptions,
    onClickChangePassword,
    true,
    { userGroups: currentUser.get("userGroups", fromJS([])) }
  );

  // eslint-disable-next-line react/no-multi-comp
  const renderBottom = formMethods => (
    <ChangePassword
      formMode={formMode}
      i18n={i18n}
      open={dialogOpen}
      parentFormMethods={formMethods}
      pending={pending}
      close={dialogClose}
    />
  );

  return (
    <LoadingIndicator hasData={currentUser.size > 0} loading={!currentUser.size} type={NAMESPACE}>
      <PageContainer>
        <PageHeading title={pageHeading}>
          {editButton}
          {saveButton}
        </PageHeading>
        <PageContent>
          <Form
            formID={FORM_ID}
            useCancelPrompt
            onSubmit={handleSubmit}
            validations={validationSchema}
            formMode={formMode}
            formSections={formSections}
            renderBottom={renderBottom}
            initialValues={initialValues}
            formErrors={formErrors}
          />
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
