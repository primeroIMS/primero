import React, { useRef, useEffect } from "react";
import { fromJS } from "immutable";
import PropTypes from "prop-types";
import { useDispatch, useSelector, batch } from "react-redux";
import { push } from "connected-react-router";
import { useLocation, useParams } from "react-router-dom";

import { useI18n } from "../../../i18n";
import Form, { FormAction, whichFormMode } from "../../../form";
import { PageHeading, PageContent } from "../../../page";
import { LoadingIndicator } from "../../../loading-indicator";
import NAMESPACE from "../namespace";
import { ROUTES } from "../../../../config";
import {
  getSystemPermissions,
  getResourceActions,
  selectAgencies,
  selectModules
} from "../../../application";
import { fetchRoles } from "../roles-list";
import { getRecords } from "../../../index-table";
import { getFormsByParentForm } from "../../../record-form";
import { compare } from "../../../../libs";

import { validations } from "./form";
import { getFormsToRender, mergeFormSections } from "./helpers";
import { fetchRole, clearSelectedRole, saveRole } from "./action-creators";
import { getRole, getServerErrors } from "./selectors";

const Container = ({ mode }) => {
  const formMode = whichFormMode(mode);
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const isEditOrShow = formMode.get("isEdit") || formMode.get("isShow");
  const primeroModules = useSelector(state => selectModules(state), compare);
  const roles = useSelector(state => getRecords(state, "roles"), compare);
  const role = useSelector(state => getRole(state), compare);
  const agencies = useSelector(state => selectAgencies(state), compare);
  const formErrors = useSelector(state => getServerErrors(state), compare);
  const systemPermissions = useSelector(state =>
    getSystemPermissions(state),
    compare
  );
  const roleActions = useSelector(
    state => getResourceActions(state, "role"),
    compare
  );
  const agencyActions = useSelector(
    state => getResourceActions(state, "agency"),
    compare
  );
  const formSections = useSelector(
    state => getFormsByParentForm(state),
    compare
  );

  const validationSchema = validations(formMode, i18n);

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

  const bindFormSubmit = () => {
    formRef.current.submitForm();
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
    formMode,
    formSections 
  })

  return (
    <LoadingIndicator
      hasData={formMode.get("isNew") || role?.size > 0}
      type={NAMESPACE}
    >
      <PageHeading title={pageHeading}>
        {editButton}
        {saveButton}
      </PageHeading>
      <PageContent>
        <Form
          useCancelPrompt
          mode={mode}
          formSections={formsToRender}
          onSubmit={handleSubmit}
          ref={formRef}
          validations={validationSchema}
          initialValues={mergeFormSections(role.toJS())}
          formErrors={formErrors}
        />
      </PageContent>
    </LoadingIndicator>
  );
};

Container.displayName = "RolesForm";

Container.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Container;
