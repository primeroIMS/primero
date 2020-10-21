import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { object } from "yup";
import { Formik, Form } from "formik";
import isEmpty from "lodash/isEmpty";
import { Box } from "@material-ui/core";
import NavigationPrompt from "react-router-navigation-prompt";
import { batch, useDispatch } from "react-redux";

import { setSelectedForm } from "../action-creators";
import { clearCaseFromIncident } from "../../records/action-creators";
import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import { constructInitialValues } from "../utils";
import { SUBFORM_SECTION } from "../constants";
import RecordFormAlerts from "../../record-form-alerts";
import { displayNameHelper } from "../../../libs";
import { INCIDENT_FROM_CASE, RECORD_TYPES } from "../../../config";

import { ValidationErrors } from "./components";
import RecordFormTitle from "./record-form-title";
import { RECORD_FORM_NAME } from "./constants";
import FormSectionField from "./form-section-field";
import SubformField from "./subforms";
import { fieldValidations } from "./validations";

const RecordForm = ({
  bindSubmitForm,
  forms,
  handleToggleNav,
  mobileDisplay,
  mode,
  onSubmit,
  record,
  recordType,
  selectedForm,
  incidentFromCase,
  externalForms,
  fetchFromCaseId
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState(constructInitialValues(forms.values()));

  let bindedSetValues = null;

  const bindSetValues = setValues => {
    bindedSetValues = setValues;
  };

  const buildValidationSchema = formSections => {
    const schema = formSections.reduce((obj, item) => {
      return Object.assign({}, obj, ...item.fields.map(f => fieldValidations(f, i18n)));
    }, {});

    return object().shape(schema);
  };

  useEffect(() => {
    document.getElementsByClassName("record-form-container")[0].scrollTop = 0;
  }, [selectedForm]);

  useEffect(() => {
    if (bindedSetValues) {
      if (incidentFromCase?.size && mode.isNew && RECORD_TYPES[recordType] === RECORD_TYPES.incidents) {
        const incidentCaseId = fetchFromCaseId ? { incident_case_id: fetchFromCaseId } : {};

        bindedSetValues({ ...initialValues, ...incidentFromCase.toJS(), ...incidentCaseId });
      }
    }
  }, [bindedSetValues, incidentFromCase]);

  useEffect(() => {
    const redirectToIncident = RECORD_TYPES.cases === recordType ? { redirectToIncident: false } : {};

    if (record) {
      setInitialValues({ ...initialValues, ...record.toJS(), ...redirectToIncident });
    }
  }, [record]);

  const handleConfirm = onConfirm => {
    onConfirm();
    if (incidentFromCase?.size) {
      batch(() => {
        dispatch(setSelectedForm(INCIDENT_FROM_CASE));
        dispatch(clearCaseFromIncident());
      });
    }
  };
  const renderFormSections = (fs, setFieldValue, handleSubmit) => {
    const externalRecordForms = externalForms ? externalForms(selectedForm, setFieldValue, handleSubmit) : null;

    if (externalRecordForms) {
      return externalRecordForms;
    }

    return fs.map(form => {
      if (selectedForm === form.unique_id) {
        return (
          <div key={form.unique_id}>
            <RecordFormTitle
              mobileDisplay={mobileDisplay}
              handleToggleNav={handleToggleNav}
              displayText={displayNameHelper(form.name, i18n.locale)}
            />

            <RecordFormAlerts recordType={recordType} form={form} />

            {form.fields.map(field => {
              const fieldProps = {
                field,
                form,
                mode,
                recordType,
                recordID: record?.get("id")
              };

              if (!field?.visible) {
                return null;
              }

              return (
                <Box my={3} key={field.name}>
                  {SUBFORM_SECTION === field.type ? (
                    <SubformField {...{ ...fieldProps, formSection: field.subform_section_id }} />
                  ) : (
                    <FormSectionField name={field.name} {...{ ...fieldProps, formSection: form }} />
                  )}
                </Box>
              );
            })}
          </div>
        );
      }

      return null;
    });
  };

  if (!isEmpty(initialValues) && !isEmpty(forms)) {
    const validationSchema = buildValidationSchema(forms);

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        enableReinitialize
        onSubmit={values => {
          onSubmit(initialValues, values);
        }}
      >
        {({ handleSubmit, submitForm, errors, dirty, isSubmitting, setValues, setFieldValue }) => {
          bindSubmitForm(submitForm);
          bindSetValues(setValues);

          return (
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <NavigationPrompt when={dirty && !isSubmitting && !mode.isShow}>
                {({ onConfirm, onCancel }) => (
                  <ActionDialog
                    open
                    successHandler={() => handleConfirm(onConfirm)}
                    cancelHandler={onCancel}
                    dialogTitle={i18n.t("record_panel.record_information")}
                    dialogText={i18n.t("messages.confirmation_message")}
                    confirmButtonLabel={i18n.t("buttons.ok")}
                  />
                )}
              </NavigationPrompt>
              <ValidationErrors formErrors={errors} forms={forms} />
              {renderFormSections(forms, setFieldValue, handleSubmit)}
            </Form>
          );
        }}
      </Formik>
    );
  }

  return null;
};

RecordForm.displayName = RECORD_FORM_NAME;

RecordForm.propTypes = {
  bindSubmitForm: PropTypes.func,
  externalForms: PropTypes.func,
  fetchFromCaseId: PropTypes.string,
  forms: PropTypes.object.isRequired,
  handleToggleNav: PropTypes.func.isRequired,
  incidentFromCase: PropTypes.object,
  mobileDisplay: PropTypes.bool.isRequired,
  mode: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default memo(RecordForm);
