import { Fragment } from "react";
import { Box } from "@material-ui/core";

import { SUBFORM_SECTION } from "../constants";
import RecordFormAlerts from "../../record-form-alerts";
import { displayNameHelper } from "../../../libs";
import RecordFormTitle from "../form/record-form-title";
import { RECORD_FORM_PERMISSION } from "../form/constants";
import FormSectionField from "../form/form-section-field";
import SubformField from "../form/subforms";

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

      return (
        <Fragment key={form.unique_id}>
          <RecordFormTitle
            mobileDisplay={mobileDisplay}
            handleToggleNav={handleToggleNav}
            displayText={displayNameHelper(form.name, i18n.locale)}
          />

          <RecordFormAlerts recordType={recordType} form={form} attachmentForms={attachmentForms} />

          {form.fields.map(field => {
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

            return (
              <Box my={3} key={field.name}>
                {SUBFORM_SECTION === field.type ? (
                  <SubformField {...{ ...fieldProps, formSection: field.subform_section_id, isReadWriteForm }} />
                ) : (
                  <FormSectionField name={field.name} {...{ ...fieldProps, formSection: form, isReadWriteForm }} />
                )}
              </Box>
            );
          })}
        </Fragment>
      );
    }

    return null;
  });
};

export default renderFormSections;
