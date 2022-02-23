import { Fragment } from "react";
import isEmpty from "lodash/isEmpty";

import { SUBFORM_SECTION } from "../constants";
import RecordFormAlerts from "../../record-form-alerts";
import { displayNameHelper } from "../../../libs";
import RecordFormTitle from "../form/record-form-title";
import { RECORD_FORM_PERMISSION } from "../form/constants";
import FormSectionField from "../form/form-section-field";
import SubformField from "../form/subforms";
import { parseExpression } from "../../../libs/expressions";
import { getViolationFieldForGuidance, isViolationSubform } from "../form/utils";
import getOptionStringsTags from "../form/utils/get-option-strings-tags";
import { RECORD_TYPES, REGISTRY_FROM_CASE } from "../../../config";
import CaseRegistry from "../form/components/case-registry";

const renderFormFields = (
  forms,
  form,
  mode,
  recordType,
  record,
  primeroModule,
  isReadWriteForm,
  guidanceFieldForViolation,
  values
) => {
  return form.fields.map(field => {
    const tags = getOptionStringsTags(field, values);
    const fieldProps = {
      field,
      form,
      mode,
      recordType,
      recordID: record?.get("id"),
      recordModuleID: primeroModule,
      ...(isEmpty(tags) ? {} : { tags })
    };

    if (!field?.visible) {
      return null;
    }

    if (guidanceFieldForViolation === field.name) {
      return null;
    }

    if (
      !isEmpty(field.display_conditions_record) &&
      !parseExpression(field.display_conditions_record).evaluate(values)
    ) {
      return null;
    }

    return (
      <div key={field.name}>
        {SUBFORM_SECTION === field.type ? (
          <SubformField {...{ ...fieldProps, formSection: field.subform_section_id, isReadWriteForm, forms }} />
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
            displayText: i18n.t("incident.violation.title"),
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
          {renderFormFields(
            fs,
            form,
            mode,
            recordType,
            record,
            primeroModule,
            isReadWriteForm,
            fieldForGuidance?.name,
            values
          )}
          {form.unique_id === REGISTRY_FROM_CASE && (
            <CaseRegistry
              values={values}
              record={record}
              mode={mode}
              primeroModule={primeroModule}
              recordType={RECORD_TYPES[recordType]}
              name={form.name}
              setFieldValue={setFieldValue}
            />
          )}
        </Fragment>
      );
    }

    return null;
  });
};

export default renderFormSections;
