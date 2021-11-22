import { Fragment } from "react";

import { SUBFORM_SECTION } from "../constants";
import RecordFormAlerts from "../../record-form-alerts";
import { displayNameHelper } from "../../../libs";
import RecordFormTitle from "../form/record-form-title";
import { RECORD_FORM_PERMISSION } from "../form/constants";
import FormSectionField from "../form/form-section-field";
import SubformField from "../form/subforms";
import { getViolationFieldForGuidance, isViolationSubform } from "../form/utils";

const renderFormFields = (
  form,
  mode,
  recordType,
  record,
  primeroModule,
  isReadWriteForm,
  guidanceFieldForViolation
) => {
  return form.fields.map(field => {
    const fieldProps = {
      field,
      form,
      mode,
      recordType,
      recordID: record?.get("id"),
      recordModuleID: primeroModule
    };

    if (!field?.visible) {
      return null;
    }

    if (guidanceFieldForViolation === field.name) {
      return null;
    }

    return (
      <div key={field.name}>
        {SUBFORM_SECTION === field.type ? (
          <SubformField {...{ ...fieldProps, formSection: field.subform_section_id, isReadWriteForm }} />
        ) : (
          <FormSectionField name={field.name} {...{ ...fieldProps, formSection: form, isReadWriteForm }} />
        )}
      </div>
    );
  });
};

const renderFormSections = (
  externalForms,
  selectedForm,
  userPermittedFormsIds,
  mobileDisplay,
  handleToggleNav,
  i18n,
  recordType,
  attachmentForms,
  mode,
  record,
  primeroModule
) => (fs, setFieldValue, handleSubmit, values, dirty) => {
  const externalRecordForms = externalForms
    ? externalForms(selectedForm, setFieldValue, handleSubmit, values, dirty)
    : null;

  if (externalRecordForms) {
    return externalRecordForms;
  }

  return fs.map(form => {
    if (selectedForm === form.unique_id) {
      const isReadWriteForm = userPermittedFormsIds?.get(selectedForm) === RECORD_FORM_PERMISSION.readWrite;

      const isViolation = isViolationSubform(recordType, selectedForm);
      const fieldForGuidance = isViolation ? getViolationFieldForGuidance(form.fields) : {};

      const titleProps = isViolation
        ? {
            displayText: i18n.t("forms.record_types.violation"),
            subTitle: displayNameHelper(form.name, i18n.locale),
            subTitleGuidance: fieldForGuidance.guiding_questions
          }
        : { displayText: displayNameHelper(form.name, i18n.locale) };

      return (
        <Fragment key={form.unique_id}>
          <RecordFormTitle
            mobileDisplay={mobileDisplay}
            handleToggleNav={handleToggleNav}
            mode={mode}
            i18n={i18n}
            {...titleProps}
          />

          <RecordFormAlerts recordType={recordType} form={form} attachmentForms={attachmentForms} />
          {renderFormFields(form, mode, recordType, record, primeroModule, isReadWriteForm, fieldForGuidance?.name)}
        </Fragment>
      );
    }

    return null;
  });
};

export default renderFormSections;
