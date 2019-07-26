import React, { memo } from "react";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import isEmpty from "lodash/isEmpty";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useI18n } from "components/i18n";
import { constructInitialValues } from "../helpers";
import FormSectionField from "./FormSectionField";
import styles from "./styles.css";
import SubformField from "./SubformField";
import * as C from "../constants";

const RecordForm = ({
  selectedForm,
  forms,
  onSubmit,
  mode,
  bindSubmitForm,
  record
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  let initialFormValues = constructInitialValues(forms);

  if (record) {
    initialFormValues = Object.assign({}, initialFormValues, record.toJS());
  }

  const renderFormSections = fs =>
    fs.map(form => {
      if (selectedForm === form.unique_id) {
        return (
          <div key={form.unique_id}>
            <h1 className={css.formHeading}>{form.name[i18n.locale]}</h1>
            {form.fields.map(field => {
              const fieldProps = {
                field,
                mode
              };

              return (
                <Box my={3} key={field.name}>
                  {C.SUBFORM_SECTION === field.type ? (
                    <SubformField {...fieldProps} />
                  ) : (
                    <FormSectionField name={field.name} {...fieldProps} />
                  )}
                </Box>
              );
            })}
          </div>
        );
      }
      return null;
    });

  if (!isEmpty(initialFormValues) && !isEmpty(forms)) {
    return (
      <Formik
        initialValues={initialFormValues}
        onSubmit={(values, { setSubmitting }) =>
          onSubmit(initialFormValues, values, setSubmitting)
        }
      >
        {({ handleSubmit, submitForm }) => {
          bindSubmitForm(submitForm);

          return (
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              {renderFormSections(forms)}
            </Form>
          );
        }}
      </Formik>
    );
  }

  return null;
};

RecordForm.propTypes = {
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  forms: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  mode: PropTypes.object,
  bindSubmitForm: PropTypes.func,
  record: PropTypes.object
};

export default memo(RecordForm);
