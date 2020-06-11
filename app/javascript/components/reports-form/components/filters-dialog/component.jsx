import React, { useEffect, useRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { FormContext, useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/styles";
import isEmpty from "lodash/isEmpty";

import ActionDialog from "../../../action-dialog";
import bindFormSubmit from "../../../../libs/submit-form";
import { useI18n } from "../../../i18n";
import FormSection from "../../../form/components/form-section";
import {
  whichFormMode,
  SELECT_FIELD,
  RADIO_FIELD,
  TICK_FIELD
} from "../../../form";

import { ATTRIBUTE, CONSTRAINT, NAME, VALUE } from "./constants";
import styles from "./styles.css";
import form from "./form";

const Component = ({
  fields,
  open,
  setOpen,
  selectedIndex,
  setSelectedIndex,
  indexes,
  onSuccess
}) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const isNew = selectedIndex === null;

  const formMethods = useForm();
  const formMode = whichFormMode("edit");
  const formRef = useRef();
  const fieldName = isNew
    ? i18n.t("report.filters.label_new")
    : i18n.t("report.filters.label");

  const watchedAttribute = formMethods.watch(ATTRIBUTE);
  const watchedConstraint = formMethods.watch(CONSTRAINT);
  // const watchedValue = formMethods.watch(VALUE);
  const isConstraintNotNullOrTrue =
    watchedConstraint === "not_null" ||
    (typeof watchedConstraint === "boolean" && watchedConstraint);

  const currentField = fields.find(f => f.id === watchedAttribute);
  const selectedReportFilter = indexes.find(
    i => i.index.toString() === selectedIndex
  )?.data;

  if (
    [SELECT_FIELD, RADIO_FIELD].includes(currentField?.type) &&
    typeof watchedConstraint === "boolean" &&
    watchedConstraint
  ) {
    if (!isEmpty(formMethods.getValues()[VALUE])) {
      formMethods.setValue(VALUE, []);
    }
  }

  const onClose = () => {
    setOpen(false);
    setSelectedIndex(null);
  };

  const onSubmit = data => {
    onSuccess(selectedIndex, data, currentField);
    onClose();
  };

  useEffect(() => {
    if (selectedIndex !== null) {
      const { type } = fields.find(
        f => f.id === selectedReportFilter.attribute
      );

      formMethods.reset({
        ...selectedReportFilter,
        constraint:
          [SELECT_FIELD, TICK_FIELD].includes(type) &&
          Array.isArray(selectedReportFilter?.constraint) &&
          selectedReportFilter?.constraint?.includes("not_null")
            ? true
            : selectedReportFilter?.constraint
      });
    }
    if (selectedIndex === null && open) {
      formMethods.reset({ attribute: "", constraint: "", value: "" });
    }
  }, [open]);

  useEffect(() => {
    if (watchedAttribute) {
      const filterValue = formMethods.getValues()[VALUE];

      if ([TICK_FIELD, SELECT_FIELD, RADIO_FIELD].includes(currentField.type)) {
        formMethods.reset({
          attribute: formMethods.getValues()[ATTRIBUTE],
          constraint: isNew
            ? false
            : (Array.isArray(filterValue) &&
                filterValue.includes("not_null")) ||
              formMethods.getValues()[CONSTRAINT],
          value:
            isNew ||
            (Array.isArray(filterValue) && filterValue.includes("not_null"))
              ? []
              : formMethods.getValues()[VALUE]
        });
      } else {
        formMethods.reset({
          attribute: formMethods.getValues()[ATTRIBUTE],
          constraint: isNew ? "" : formMethods.getValues()[CONSTRAINT],
          value: isNew ? [] : formMethods.getValues()[VALUE]
        });
      }
    }
  }, [watchedAttribute]);

  useImperativeHandle(formRef, () => ({
    submitForm(e) {
      formMethods.handleSubmit(data => {
        onSubmit(data);
      })(e);
    }
  }));

  const reportFiltersForm = form(
    i18n,
    fields,
    currentField,
    isConstraintNotNullOrTrue,
    css
  );

  return (
    <>
      <ActionDialog
        confirmButtonLabel={i18n.t("buttons.save")}
        dialogTitle={fieldName}
        onClose={onClose}
        cancelHandler={onClose}
        open={open}
        successHandler={() => bindFormSubmit(formRef)}
      >
        <FormContext {...formMethods} formMode={formMode}>
          <form>
            {reportFiltersForm.map(formSection => (
              <FormSection
                formSection={formSection}
                key={formSection.unique_id}
              />
            ))}
          </form>
        </FormContext>
      </ActionDialog>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  fields: PropTypes.array,
  indexes: PropTypes.array,
  methods: PropTypes.object,
  onSuccess: PropTypes.func,
  open: PropTypes.bool.isRequired,
  selectedIndex: PropTypes.string,
  setIndexes: PropTypes.func,
  setOpen: PropTypes.func.isRequired,
  setSelectedIndex: PropTypes.func
};

export default Component;
