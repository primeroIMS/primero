import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { useParams } from "react-router-dom";
import { fromJS } from "immutable";

import { useI18n } from "../../../i18n";
import Form, { whichFormMode, PARENT_FORM } from "../../../form";
import { PageHeading, PageContent } from "../../../page";
import LoadingIndicator from "../../../loading-indicator";
import { ROUTES } from "../../../../config";
import { fetchRoles, getSystemPermissions, useApp } from "../../../application";
import { getAssignableForms } from "../../../record-form";
import { useMemoizedSelector } from "../../../../libs";
import { getReportingLocationConfig } from "../../../user/selectors";
import { usePermissions } from "../../../user";
import { COPY_ROLES } from "../../../../libs/permissions";

import NAMESPACE from "./namespace";
import { Validations, ActionButtons } from "./forms";
import { getFormsToRender, mergeFormSections, groupSelectedIdsByParentForm } from "./utils";
import { clearSelectedRole, fetchRole, saveRole, clearCopyRole } from "./action-creators";
import { getRole, getCopiedRole } from "./selectors";
import { NAME, FORM_ID } from "./constants";
import RolesActions from "./roles-actions";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");

  const i18n = useI18n();
  const { approvalsLabels, limitedProductionSite } = useApp();
  const dispatch = useDispatch();
  const { id } = useParams();

  const canCopyRole = usePermissions(NAMESPACE, COPY_ROLES);
  const role = useMemoizedSelector(state => getRole(state));
  const systemPermissions = useMemoizedSelector(state => getSystemPermissions(state));
  const assignableForms = useMemoizedSelector(state => getAssignableForms(state));
  const reportingLocationConfig = useMemoizedSelector(state => getReportingLocationConfig(state));
  const copiedRole = useMemoizedSelector(state => getCopiedRole(state));

  const adminLevelMap = reportingLocationConfig.get("admin_level_map") || fromJS({});

  const formsByParentForm = assignableForms.groupBy(assignableForm => assignableForm.get(PARENT_FORM));

  const validationSchema = Validations(i18n);

  const isCopiedRole = formMode.get("isNew") && copiedRole.size > 0;

  const handleSubmit = data => {
    dispatch(
      saveRole({
        id,
        saveMethod: formMode.get("isEdit") ? "update" : "new",
        body: { data: mergeFormSections(data) },
        message: i18n.t(`role.messages.${formMode.get("isEdit") ? "updated" : "created"}`)
      })
    );
  };

  const handleCancel = () => {
    dispatch(push(ROUTES.admin_roles));
  };

  useEffect(() => {
    dispatch(fetchRoles());

    return () => {
      if (isCopiedRole) {
        dispatch(clearCopyRole());
      }
    };
  }, []);

  useEffect(() => {
    if (isEditOrShow) {
      dispatch(fetchRole(id));
    }

    return () => {
      if (isEditOrShow) {
        dispatch(clearSelectedRole());
      }
    };
  }, [id]);

  const pageHeading = `${i18n.t("role.label")} ${role && role.get("name", "")}`;

  const formsToRender = getFormsToRender({
    systemPermissions,
    formSections: formsByParentForm,
    i18n,
    formMode,
    approvalsLabels,
    adminLevelMap
  });

  const initialValues = isCopiedRole
    ? copiedRole?.toJS()
    : groupSelectedIdsByParentForm(
        role.filter(prop => Boolean(prop)),
        assignableForms
      ).toJS();

  const hasData = formMode.get("isNew") || (role?.size > 0 && assignableForms.size > 0);
  const loading = !role.size || !assignableForms.size;

  return (
    <LoadingIndicator hasData={hasData} loading={loading} type={NAMESPACE}>
      <PageHeading title={pageHeading}>
        <ActionButtons
          formMode={formMode}
          formID={FORM_ID}
          handleCancel={handleCancel}
          limitedProductionSite={limitedProductionSite}
        />
        {!formMode.get("isNew") && <RolesActions canCopyRole={canCopyRole} initialValues={initialValues} />}
      </PageHeading>
      <PageContent>
        <Form
          formID={FORM_ID}
          useCancelPrompt
          mode={mode}
          formSections={formsToRender}
          onSubmit={handleSubmit}
          validations={validationSchema}
          initialValues={initialValues}
          submitAllFields={isCopiedRole}
          submitAlways={isCopiedRole}
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
