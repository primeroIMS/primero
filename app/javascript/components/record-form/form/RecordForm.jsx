import React from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import isEmpty from "lodash/isEmpty";
import FormSection from "./FormSection";
import * as C from "../constants";

const RecordForm = ({
  selectedForm,
  forms,
  onSubmit,
  mode,
  bindSubmitForm,
  record
}) => {
  let initialFormValues = !isEmpty(forms)
    ? Object.assign(
        {},
        ...forms.map(v =>
          Object.assign(
            {},
            ...v.fields.map(f => {
              let defaultValue;

              if ([C.SUBFORM_SECTION].includes(f.type)) {
                defaultValue = [];
              } else if (f.type === C.DATE_FIELD) {
                defaultValue = null;
              } else {
                defaultValue = "";
              }

              return { [f.name]: defaultValue };
            })
          )
        )
      )
    : {};

  if (record) {
    initialFormValues = Object.assign({}, initialFormValues, record.toJS());
  }

  return (
    <Formik initialValues={initialFormValues} onSubmit={onSubmit}>
      {({ values, handleSubmit, submitForm }) => {
        bindSubmitForm(submitForm);

        return (
          <Form onSubmit={handleSubmit}>
            {!isEmpty(forms) &&
              forms.map(form => {
                if (selectedForm === form.id) {
                  return (
                    <FormSection
                      form={form}
                      values={values}
                      key={form.id}
                      mode={mode}
                    />
                  );
                }
                return null;
              })}
          </Form>
        );
      }}
    </Formik>
  );
};

RecordForm.propTypes = {
  selectedForm: PropTypes.string,
  forms: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  mode: PropTypes.object,
  bindSubmitForm: PropTypes.func,
  record: PropTypes.object
};

export default RecordForm;
