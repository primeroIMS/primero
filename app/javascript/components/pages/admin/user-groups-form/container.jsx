import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

import { useI18n } from "../../../i18n";
import Form, { FormAction, whichFormMode } from "../../../form";
import { PageHeading, PageContent } from "../../../page";
import LoadingIndicator from "../../../loading-indicator";
import NAMESPACE from "../user-groups-list/namespace";
import { ROUTES, SAVE_METHODS } from "../../../../config";
import { usePermissions } from "../../../user";
import { WRITE_RECORDS } from "../../../../libs/permissions";
import { useMemoizedSelector } from "../../../../libs";

import { form, validations } from "./form";
import { fetchUserGroup, clearSelectedUserGroup, saveUserGroup } from "./action-creators";
import { getUserGroup, getServerErrors, getSavingRecord } from "./selectors";
import { NAME, FORM_ID } from "./constants";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");

  const i18n = useI18n();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const cantEditUserGroup = usePermissions(NAMESPACE, WRITE_RECORDS);

  const userGroup = useMemoizedSelector(state => getUserGroup(state));
  const formErrors = useMemoizedSelector(state => getServerErrors(state));
  const saving = useMemoizedSelector(state => getSavingRecord(state));

  const validationSchema = validations(formMode, i18n);

  const handleSubmit = data => {
    dispatch(
      saveUserGroup({
        id,
        saveMethod: formMode.get("isEdit") ? SAVE_METHODS.update : SAVE_METHODS.new,
        body: { data },
        message: i18n.t(`user_group.messages.${formMode.get("isEdit") ? "updated" : "created"}`)
      })
    );
  };

  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };

  const handleCancel = () => {
    dispatch(push(ROUTES.admin_user_groups));
  };

  useEffect(() => {
    if (isEditOrShow) {
      dispatch(fetchUserGroup(id));
    }

    return () => {
      if (isEditOrShow) {
        dispatch(clearSelectedUserGroup());
      }
    };
  }, [id]);

  const saveButton =
    formMode.get("isEdit") || formMode.get("isNew") ? (
      <>
        <FormAction cancel actionHandler={handleCancel} text={i18n.t("buttons.cancel")} startIcon={<ClearIcon />} />
        <FormAction
          options={{ form: FORM_ID, type: "submit" }}
          text={i18n.t("buttons.save")}
          savingRecord={saving}
          startIcon={<CheckIcon />}
        />
      </>
    ) : null;

  const editButton = formMode.get("isShow") ? (
    <FormAction actionHandler={handleEdit} text={i18n.t("buttons.edit")} startIcon={<CreateIcon />} />
  ) : null;

  const pageHeading = userGroup?.size
    ? `${i18n.t("user_groups.label")} ${userGroup.get("name")}`
    : i18n.t("user_groups.label");

  return (
    <LoadingIndicator
      hasData={formMode.get("isNew") || userGroup?.size > 0}
      loading={!userGroup?.size}
      type={NAMESPACE}
    >
      <PageHeading title={pageHeading}>
        {cantEditUserGroup && editButton}
        {saveButton}
      </PageHeading>
      <PageContent>
        <Form
          formID={FORM_ID}
          useCancelPrompt
          mode={mode}
          formSections={form(i18n, formMode)}
          onSubmit={handleSubmit}
          validations={validationSchema}
          initialValues={userGroup.toJS()}
          formErrors={formErrors}
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
