import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";

import { useI18n } from "../../../i18n";
import Form, { whichFormMode, PARENT_FORM } from "../../../form";
import { PageHeading, PageContent } from "../../../page";
import LoadingIndicator from "../../../loading-indicator";
import NAMESPACE from "../namespace";
import { ROUTES } from "../../../../config";
import {
  getSystemPermissions,
  getResourceActions,
  selectAgencies,
  selectModules,
  RESOURCES
} from "../../../application";
import { fetchRoles, ADMIN_NAMESPACE } from "../roles-list";
import { getRecords } from "../../../index-table";
import { getAssignableForms } from "../../../record-form";
import { compare } from "../../../../libs";

import { Validations, ActionButtons } from "./forms";
import {
  getFormsToRender,
  mergeFormSections,
  groupSelectedIdsByParentForm
} from "./utils";
import { fetchRole, clearSelectedRole, saveRole } from "./action-creators";
import { getRole } from "./selectors";
import { NAME } from "./constants";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");
  const primeroModules = useSelector(state => selectModules(state), compare);
  const roles = useSelector(
    state => getRecords(state, [ADMIN_NAMESPACE, NAMESPACE]),
    compare
  );
  const role = useSelector(state => getRole(state), compare);
  const agencies = useSelector(state => selectAgencies(state), compare);
  const systemPermissions = useSelector(
    state => getSystemPermissions(state),
    compare
  );
  const roleActions = useSelector(
    state => getResourceActions(state, RESOURCES.role),
    compare
  );
  const agencyActions = useSelector(
    state => getResourceActions(state, RESOURCES.agency),
    compare
  );
  const assignableForms = useSelector(
    state => getAssignableForms(state),
    compare
  );

  const formsByParentForm = assignableForms.groupBy(assignableForm =>
    assignableForm.get(PARENT_FORM)
  );

  const validationSchema = Validations(i18n);

  const handleSubmit = data => {
    dispatch(
      saveRole({
        id,
        saveMethod: formMode.get("isEdit") ? "update" : "new",
        body: { data: mergeFormSections(data) },
        message: i18n.t(
          `role.messages.${formMode.get("isEdit") ? "updated" : "created"}`
        )
      })
    );
  };

  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };

  const handleCancel = () => {
    dispatch(push(ROUTES.admin_roles));
  };

  useEffect(() => {
    dispatch(fetchRoles());
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

  const pageHeading = role?.size
    ? `${i18n.t("roles.label")} ${role.get("name")}`
    : i18n.t("roles.label");

  const formsToRender = getFormsToRender({
    primeroModules,
    systemPermissions,
    i18n,
    roles,
    agencies,
    roleActions,
    agencyActions,
    formSections: formsByParentForm
  });

  const initialValues = groupSelectedIdsByParentForm(
    role.filter(prop => Boolean(prop)),
    assignableForms
  ).toJS();

  return (
    <LoadingIndicator
      hasData={formMode.get("isNew") || role?.size > 0}
      type={NAMESPACE}
    >
      <PageHeading title={pageHeading}>
        <ActionButtons formMode={formMode} formRef={formRef} handleCancel={handleCancel} handleEdit={handleEdit} />
      </PageHeading>
      <PageContent>
        <Form
          useCancelPrompt
          mode={mode}
          formSections={formsToRender}
          onSubmit={handleSubmit}
          ref={formRef}
          validations={validationSchema}
          initialValues={initialValues}
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
