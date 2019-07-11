import React from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import isEmpty from "lodash/isEmpty";
import FormSection from "./FormSection";
import { constructInitialValues } from "../helpers";

const RecordForm = ({
  selectedForm,
  forms,
  onSubmit,
  mode,
  bindSubmitForm,
  record
}) => {
  let initialFormValues = constructInitialValues(forms);

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
                if (selectedForm === form.unique_id) {
                  return (
                    <FormSection
                      form={form}
                      values={values}
                      key={form.unique_id}
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
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  forms: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  mode: PropTypes.object,
  bindSubmitForm: PropTypes.func,
  record: PropTypes.object
};

export default RecordForm;
