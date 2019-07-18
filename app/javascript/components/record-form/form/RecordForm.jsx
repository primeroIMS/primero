import React, { memo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { addDays } from "date-fns";
import isEmpty from "lodash/isEmpty";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useI18n } from "components/i18n";
import { enqueueSnackbar } from "components/notifier";
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
  const dispatch = useDispatch();
  const css = makeStyles(styles)();
  const i18n = useI18n();

  let initialFormValues = constructInitialValues(forms);

  if (record) {
    initialFormValues = Object.assign({}, initialFormValues, record.toJS());
  }

  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    if (showErrorMessage) {
      dispatch(enqueueSnackbar(i18n.t("error_message.notice"), "error"));
    }
  }, [showErrorMessage]);

  const fieldValidations = field => {
    const name = field.get("name");
    const type = field.get("type");

    const validations = {};

    if (C.NUMERIC_FIELD === type) {
      if (name.match(/.*age$/)) {
        validations[name] = yup
          .number()
          .nullable()
          .min(0, i18n.t("errors.models.child.age"))
          .max(130, i18n.t("errors.models.child.age"));
      } else {
        validations[name] = yup
          .number()
          .nullable()
          .min(0)
          .max(2147483647);
      }
    } else if (C.DATE_FIELD === type) {
      validations[name] = yup.date().nullable();
      if (field.get("date_validation") === "default_date_validation") {
        validations[name] = validations[name].max(
          addDays(new Date(), 1),
          i18n.t("fields.future_date_not_valid")
        );
      }
    } else if (C.SUBFORM_SECTION === type) {
      const subformSchema = field.subform_section_id.get("fields").map(sf => {
        return fieldValidations(sf);
      });
      validations[name] = yup
        .array()
        .of(yup.object().shape(Object.assign({}, ...subformSchema)));
    }

    if (field.get("required")) {
      validations[name] = (validations[name] || yup.string()).required(
        i18n.t("form_section.required_field", {
          field: field.display_name[i18n.locale]
        })
      );
    }

    return validations;
  };

  const buildValidationSchema = formSections => {
    const schema = formSections
      .map(fs => {
        return fs.get("fields").map(f => fieldValidations(f));
      })
      .toJS()
      .flat();
    const t = Object.assign({}, ...schema);
    return yup.object().shape(t);
  };

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
    const validationSchema = buildValidationSchema(forms);
    return (
      <Formik
        initialValues={initialFormValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          return onSubmit(initialFormValues, values, setSubmitting);
        }}
      >
        {({ handleSubmit, submitForm, errors, isSubmitting }) => {
          setShowErrorMessage(errors && isSubmitting);
          bindSubmitForm(submitForm);
          return (
            <Form onSubmit={handleSubmit}>{renderFormSections(forms)}</Form>
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
