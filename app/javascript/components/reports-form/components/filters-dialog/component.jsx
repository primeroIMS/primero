import { makeStyles } from "@material-ui/core/styles";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import ActionDialog from "../../../action-dialog";
import { RADIO_FIELD, SELECT_FIELD, TICK_FIELD, whichFormMode } from "../../../form";
import FormSection from "../../../form/components/form-section";
import { useI18n } from "../../../i18n";
import { NOT_NULL } from "../../constants";

import { ATTRIBUTE, CONSTRAINT, NAME, VALUE, FORM_ID } from "./constants";
import form from "./form";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({ fields, open, setOpen, selectedIndex, setSelectedIndex, indexes, onSuccess }) => {
  const formMode = whichFormMode("edit");

  const i18n = useI18n();
  const css = useStyles();
  const isNew = selectedIndex === null;

  const formMethods = useForm();
  const {
    control,
    reset,
    handleSubmit,
    getValues,
    formState: { dirtyFields }
  } = formMethods;

  const fieldName = isNew ? i18n.t("report.filters.label_new") : i18n.t("report.filters.label");

  const watchedAttribute = useWatch({ control, name: ATTRIBUTE });
  const watchedConstraint = useWatch({ control, name: CONSTRAINT });

  const isAttributeTouched = Object.keys(dirtyFields).includes(ATTRIBUTE);

  const isConstraintNotNullOrTrue =
    watchedConstraint === NOT_NULL || (typeof watchedConstraint === "boolean" && watchedConstraint);

  const currentField = fields.find(field => field.id === watchedAttribute);
  const selectedReportFilter = indexes[selectedIndex]?.data;

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
      const { type } = fields.find(field => field.id === selectedReportFilter.attribute);

      reset({
        ...selectedReportFilter,
        constraint:
          [SELECT_FIELD, TICK_FIELD, RADIO_FIELD].includes(type) &&
          Array.isArray(selectedReportFilter?.constraint) &&
          selectedReportFilter?.constraint?.includes(NOT_NULL)
            ? true
            : selectedReportFilter?.constraint,
        values:
          Array.isArray(selectedReportFilter?.value) && selectedReportFilter?.value.includes(NOT_NULL)
            ? []
            : selectedReportFilter?.value
      });
    }
    if (selectedIndex === null && open) {
      reset({ attribute: "" });
    }
  }, [open]);

  useEffect(() => {
    if (isConstraintNotNullOrTrue) {
      formMethods.setValue(CONSTRAINT, NOT_NULL);
    }
  }, [watchedConstraint]);

  useEffect(() => {
    if (watchedAttribute) {
      const filterValue = getValues()[VALUE];

      if ([TICK_FIELD, SELECT_FIELD, RADIO_FIELD].includes(currentField.type)) {
        reset({
          attribute: getValues()[ATTRIBUTE],
          constraint: isNew
            ? false
            : (Array.isArray(filterValue) && filterValue.includes(NOT_NULL)) || getValues()[CONSTRAINT],
          value:
            // eslint-disable-next-line no-nested-ternary
            isNew || (Array.isArray(filterValue) && filterValue.includes(NOT_NULL)) || isAttributeTouched
              ? []
              : getValues()[VALUE]
        });
      } else {
        reset({
          attribute: getValues()[ATTRIBUTE],
          constraint: isNew ? "" : getValues()[CONSTRAINT],
          value: isNew ? [] : getValues()[VALUE]
        });
      }
    }
  }, [watchedAttribute]);

  const reportFiltersForm = form(i18n, fields, currentField, isConstraintNotNullOrTrue, css);

  return (
    <>
      <ActionDialog
        confirmButtonLabel={i18n.t("buttons.save")}
        confirmButtonProps={{
          form: FORM_ID,
          type: "submit"
        }}
        dialogTitle={fieldName}
        onClose={onClose}
        cancelHandler={onClose}
        open={open}
      >
        <form id={FORM_ID} onSubmit={handleSubmit(onSubmit)}>
          {reportFiltersForm.map(formSection => (
            <FormSection
              formSection={formSection}
              key={formSection.unique_id}
              formMode={formMode}
              formMethods={formMethods}
            />
          ))}
        </form>
      </ActionDialog>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  fields: PropTypes.array,
  indexes: PropTypes.array,
  onSuccess: PropTypes.func,
  open: PropTypes.bool.isRequired,
  selectedIndex: PropTypes.string,
  setOpen: PropTypes.func.isRequired,
  setSelectedIndex: PropTypes.func
};

export default Component;
