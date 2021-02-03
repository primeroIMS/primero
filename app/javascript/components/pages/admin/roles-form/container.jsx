import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { useParams } from "react-router-dom";
import { fromJS } from "immutable";

import { useI18n } from "../../../i18n";
import Form, { whichFormMode, PARENT_FORM } from "../../../form";
import { PageHeading, PageContent } from "../../../page";
import LoadingIndicator from "../../../loading-indicator";
import { ROUTES } from "../../../../config";
import { getSystemPermissions, useApp } from "../../../application";
import { fetchRoles, ADMIN_NAMESPACE } from "../roles-list";
import { getRecords } from "../../../index-table";
import { getAssignableForms } from "../../../record-form";
import { compare } from "../../../../libs";
import ActionDialog from "../../../action-dialog";
import { getMetadata } from "../../../record-list";
import { getReportingLocationConfig } from "../../../user/selectors";

import NAMESPACE from "./namespace";
import { Validations, ActionButtons } from "./forms";
import { getFormsToRender, mergeFormSections, groupSelectedIdsByParentForm } from "./utils";
import { clearSelectedRole, deleteRole, fetchRole, saveRole } from "./action-creators";
import { getRole } from "./selectors";
import { NAME } from "./constants";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);
  const i18n = useI18n();
  const formRef = useRef();
  const { approvalsLabels } = useApp();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");
  const roles = useSelector(state => getRecords(state, [ADMIN_NAMESPACE, NAMESPACE]), compare);
  const metadata = useSelector(state => getMetadata(state, "roles"));
  const role = useSelector(state => getRole(state), compare);
  const systemPermissions = useSelector(state => getSystemPermissions(state), compare);
  const assignableForms = useSelector(state => getAssignableForms(state), compare);
  const reportingLocationConfig = useSelector(state => getReportingLocationConfig(state));
  const adminLevelMap = reportingLocationConfig.get("admin_level_map") || fromJS({});

  const formsByParentForm = assignableForms.groupBy(assignableForm => assignableForm.get(PARENT_FORM));

  const validationSchema = Validations(i18n);

  const handleSubmit = data => {
    console.log("DATA TO SUBMIT", data);
    // dispatch(
    //   saveRole({
    //     id,
    //     saveMethod: formMode.get("isEdit") ? "update" : "new",
    //     body: { data: mergeFormSections(data) },
    //     message: i18n.t(`role.messages.${formMode.get("isEdit") ? "updated" : "created"}`)
    //   })
    // );
  };

  const handleCancel = () => {
    dispatch(push(ROUTES.admin_roles));
  };

  useEffect(() => {
    dispatch(fetchRoles({ data: metadata?.toJS() }));
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
    roles,
    formSections: formsByParentForm,
    i18n,
    formMode,
    approvalsLabels,
    adminLevelMap
  });

  const initialValues = groupSelectedIdsByParentForm(
    role.filter(prop => Boolean(prop)),
    assignableForms
  ).toJS();

  const handleSuccess = () => {
    dispatch(
      deleteRole({
        id,
        message: i18n.t("role.messages.deleted")
      })
    );
    setOpenDeleteDialog(false);
  };

  const renderOpenDialog = formMode.get("isShow") ? (
    <ActionDialog
      open={openDeleteDialog}
      successHandler={handleSuccess}
      cancelHandler={() => setOpenDeleteDialog(false)}
      dialogTitle={i18n.t("role.delete_header")}
      dialogText={i18n.t("role.messages.confirmation")}
      confirmButtonLabel={i18n.t("buttons.ok")}
    />
  ) : null;

  const hasData = formMode.get("isNew") || (role?.size > 0 && assignableForms.size > 0);
  const loading = !role.size || !assignableForms.size;

  return (
    <LoadingIndicator hasData={hasData} loading={loading} type={NAMESPACE}>
      <PageHeading title={pageHeading}>
        <ActionButtons
          formMode={formMode}
          formRef={formRef}
          handleCancel={handleCancel}
          setOpenDeleteDialog={setOpenDeleteDialog}
        />
      </PageHeading>
      <PageContent>
        <Form
          useCancelPrompt
          mode={mode}
          formSections={formsToRender}
          onSubmit={handleSubmit}
          ref={formRef}
          validations={validationSchema}
          initialValues={{ ...initialValues, sex: { test: { tested: "male" } } }}
        />
      </PageContent>
      {renderOpenDialog}
    </LoadingIndicator>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Container;
