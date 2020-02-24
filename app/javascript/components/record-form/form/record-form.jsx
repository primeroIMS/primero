import React, { memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import * as yup from "yup";
import { Formik, Form } from "formik";
import { addDays } from "date-fns";
import isEmpty from "lodash/isEmpty";
import some from "lodash/some";
import { Box, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import NavigationPrompt from "react-router-navigation-prompt";

import { useI18n } from "../../i18n";
import { enqueueSnackbar } from "../../notifier";
import { ActionDialog } from "../../action-dialog";
import { constructInitialValues } from "../helpers";
import * as C from "../constants";

import RecordFormTitle from "./record-form-title";
import { RECORD_FORM_NAME } from "./constants";
import FormSectionField from "./form-section-field";
import styles from "./styles.css";
import SubformField from "./subforms";

const ValidationErrors = () => {
  const dispatch = useDispatch();
  const i18n = useI18n();

  useEffect(() => {
    dispatch(enqueueSnackbar(i18n.t("error_message.notice"), "error"));
  }, []);

  return null;
};

const RecordForm = ({
  selectedForm,
  forms,
  onSubmit,
  mode,
  bindSubmitForm,
  record,
  handleToggleNav,
  mobileDisplay,
  recordType
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  let initialFormValues = constructInitialValues(forms.values());

  if (record) {
    initialFormValues = { ...initialFormValues, ...record.toJS() };
  }

  const fieldValidations = field => {
    const { name, type, required } = field;
    const validations = {};

    if (C.NUMERIC_FIELD === type) {
      if (name.match(/.*age$/)) {
        validations[name] = yup
          .number()
          .nullable()
          .transform(cv => (NaN.isNaN(cv) ? undefined : cv))
          .positive()
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
      if (field.date_validation === "default_date_validation") {
        validations[name] = validations[name].max(
          addDays(new Date(), 1),
          i18n.t("fields.future_date_not_valid")
        );
      }
    } else if (C.SUBFORM_SECTION === type) {
      const subformSchema = field.subform_section_id.fields.map(sf => {
        return fieldValidations(sf);
      });

      validations[name] = yup
        .array()
        .of(yup.object().shape(Object.assign({}, ...subformSchema)));
    }

    if (required) {
      validations[name] = (validations[name] || yup.string()).required(
        i18n.t("form_section.required_field", {
          field: field.display_name[i18n.locale]
        })
      );
    }

    return validations;
  };

  const buildValidationSchema = formSections => {
    const schema = formSections.reduce((obj, item) => {
      return Object.assign(
        {},
        obj,
        ...item.fields.map(f => fieldValidations(f))
      );
    }, {});

    return yup.object().shape(schema);
  };

  useEffect(() => {
    document.getElementsByClassName("record-form-container")[0].scrollTop = 0;
  }, [selectedForm]);

  const renderFormSections = fs =>
    fs.map(form => {
      if (selectedForm === form.unique_id) {
        return (
          <div key={form.unique_id}>
            <RecordFormTitle
              mobileDisplay={mobileDisplay}
              handleToggleNav={handleToggleNav}
              displayText={form.name[i18n.locale]}
            />

            {form.fields.map(field => {
              const fieldProps = {
                field,
                mode,
                recordType,
                recordID: record?.get("id")
              };

              if (!field?.visible) {
                return null;
              }

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
        validateOnBlur={false}
        validateOnChange={false}
        enableReinitialize
        onSubmit={values => {
          onSubmit(initialFormValues, values);
        }}
      >
        {({ handleSubmit, submitForm, errors, dirty, isSubmitting }) => {
          bindSubmitForm(submitForm);
          const hasErrors = some(errors, e => !isEmpty(e));

          return (
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <NavigationPrompt when={dirty && !isSubmitting && !mode.isShow}>
                {({ onConfirm, onCancel }) => (
                  <ActionDialog
                    open
                    successHandler={onConfirm}
                    cancelHandler={onCancel}
                    dialogTitle={i18n.t("record_panel.record_information")}
                    dialogText={i18n.t("messages.confirmation_message")}
                    confirmButtonLabel={i18n.t("buttons.ok")}
                  />
                )}
              </NavigationPrompt>
              {!isEmpty(hasErrors) && <ValidationErrors />}
              {renderFormSections(forms)}
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
  forms: PropTypes.object.isRequired,
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  mode: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default memo(RecordForm);
