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
import { ROUTES, RECORD_TYPES } from "../../../../config";
import {
  getSystemPermissions,
  selectAgencies,
  selectModules
} from "../../../application";
import { fetchRoles } from "../roles-list";
import { getRecords } from "../../../index-table";
import { getFormsByParentForm } from "../../../record-form";

import {
  form,
  roleForms,
  agencyForms,
  resourcesForm,
  validations,
  formSectionsForm
} from "./form";
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
  const compare = (prev, next) => prev.equals(next);
  const primeroModules = useSelector(state => selectModules(state), compare);
  const roles = useSelector(state => getRecords(state, "roles"), compare);
  const role = useSelector(state => getRole(state), compare);
  const agencies = useSelector(state => selectAgencies(state), compare);
  const formErrors = useSelector(state => getServerErrors(state), compare);
  const systemPermissions = useSelector(
    state => getSystemPermissions(state),
    compare
  );
  const formSections = useSelector(
    state => getFormsByParentForm(state),
    compare
  );

  const validationSchema = validations(formMode, i18n);

  const recordTypes = [
    RECORD_TYPES.cases,
    RECORD_TYPES.tracing_requests,
    RECORD_TYPES.incidents
  ];

  const mergeFormSections = data => {
    if (!data.form_section_unique_ids) {
      return data;
    }

    const formSectionUniqueIds = recordTypes
      .map(recordType => data.form_section_unique_ids[recordType])
      .flat();

    return { ...data, form_section_unique_ids: formSectionUniqueIds };
  };

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
    batch(() => {
      dispatch(fetchRoles());
    });
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

  const roleActions = systemPermissions.getIn(
    ["resource_actions", "role"],
    fromJS([])
  );
  const agencyActions = systemPermissions.getIn(
    ["resource_actions", "agency"],
    fromJS([])
  );

  const formsToRender = fromJS(
    [
      form(
        primeroModules,
        systemPermissions.get("management", fromJS([])),
        i18n,
        formMode
      ),
      roleForms(roles, roleActions, i18n, formMode),
      agencyForms(agencies, agencyActions, i18n, formMode),
      resourcesForm(
        systemPermissions
          .get("resource_actions", fromJS({}))
          .filterNot((v, k) => ["role", "agency"].includes(k)),
        i18n,
        formMode
      ),
      formSectionsForm(formSections, i18n, formMode)
    ].flat()
  );

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
