import React, { useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { useLocation } from "react-router-dom";

import { useI18n } from "../../../i18n";
import { PageHeading, PageContent } from "../../../page";
import Form, { FormAction, whichFormMode } from "../../../form";
import { ROUTES } from "../../../../config";
import LoadingIndicator from "../../../loading-indicator";
import bindFormSubmit from "../../../../libs/submit-form";
import { MANAGE, RESOURCES } from "../../../../libs/permissions";
import Permission from "../../../application/permission";

import { NAME } from "./constants";
import { form } from "./form";
import {
  selectContactInformation,
  selectSavingContactInformation
} from "./selectors";
import { saveContactInformation } from "./action-creators";

const Component = ({ mode }) => {
  const i18n = useI18n();
  const formRef = useRef();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const formMode = whichFormMode(mode);
  const contactInformation = useSelector(state =>
    selectContactInformation(state)
  );
  const savingRecord = useSelector(state =>
    selectSavingContactInformation(state)
  );
  const handleCancel = () => {
    dispatch(push(ROUTES.contact_information));
  };
  const handleEdit = () => {
    dispatch(push(`${pathname}/edit`));
  };
  const handleSubmit = data => {
    return dispatch(
      saveContactInformation({
        saveMethod: formMode.get("isEdit") ? "update" : "new",
        body: { data },
        message: i18n.t("contact.updated")
      })
    );
  };

  const pageHeading = i18n.t("contact.info_label");
  const editButton = formMode.get("isShow") ? (
    <FormAction actionHandler={handleEdit} text={i18n.t("buttons.edit")} />
  ) : null;

  const saveButton =
    formMode.get("isEdit") || formMode.get("isNew") ? (
      <>
        <FormAction
          cancel
          actionHandler={handleCancel}
          text={i18n.t("buttons.cancel")}
        />
        <FormAction
          actionHandler={() => bindFormSubmit(formRef)}
          text={i18n.t("buttons.save")}
          savingRecord={savingRecord}
        />
      </>
    ) : null;

  return (
    <Permission resources={RESOURCES.systems} actions={MANAGE} redirect>
      <LoadingIndicator hasData={contactInformation?.size > 0} type={NAME}>
        <PageHeading title={pageHeading}>
          {editButton}
          {saveButton}
        </PageHeading>
        <PageContent>
          <Form
            useCancelPrompt
            mode={mode}
            formSections={form(i18n)}
            onSubmit={handleSubmit}
            ref={formRef}
            initialValues={contactInformation.toJS()}
          />
        </PageContent>
      </LoadingIndicator>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  mode: PropTypes.string.isRequired
};

export default Component;
