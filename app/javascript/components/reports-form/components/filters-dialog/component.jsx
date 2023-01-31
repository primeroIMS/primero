import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import ActionDialog from "../../../action-dialog";
import { RADIO_FIELD, SELECT_FIELD, whichFormMode } from "../../../form";
import FormSection from "../../../form/components/form-section";
import { useI18n } from "../../../i18n";
import { NOT_NULL } from "../../constants";

import { ATTRIBUTE, CONSTRAINT, NAME, VALUE, FORM_ID } from "./constants";
import form, { validationSchema } from "./form";
import { getFilterConstraint, getFilterValue, isNotNullConstraintOrTrue } from "./utils";
import css from "./styles.css";

const Component = ({ fields, open, setOpen, selectedIndex, setSelectedIndex, indexes, onSuccess }) => {
  const formMode = whichFormMode("edit");

  const i18n = useI18n();

  const isNew = selectedIndex === null;

  const formMethods = useForm({ resolver: yupResolver(validationSchema(i18n)) });
  const {
    control,
    reset,
    handleSubmit,
    formState: { dirtyFields }
  } = formMethods;

  const fieldName = isNew ? i18n.t("report.filters.label_new") : i18n.t("report.filters.label");

  const watchedAttribute = useWatch({ control, name: ATTRIBUTE });
  const watchedConstraint = useWatch({ control, name: CONSTRAINT });

  const isAttributeTouched = Object.keys(dirtyFields).includes(ATTRIBUTE);
  const notNullConstraintOrTrue = isNotNullConstraintOrTrue(watchedConstraint);

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
        [CONSTRAINT]: getFilterConstraint(selectedReportFilter, type),
        [VALUE]: getFilterValue(selectedReportFilter, type)
      });
    }
    if (selectedIndex === null && open) {
      reset({ attribute: "" });
    }
  }, [open]);

  useEffect(() => {
    if (notNullConstraintOrTrue) {
      formMethods.setValue(CONSTRAINT, NOT_NULL);
    } else if (watchedConstraint === false) {
      formMethods.setValue(CONSTRAINT, null);
    }
  }, [watchedConstraint]);

  useEffect(() => {
    if (isAttributeTouched) {
      formMethods.setValue(CONSTRAINT, "");
      formMethods.setValue(VALUE, []);
    }
  }, [isAttributeTouched]);

  const reportFiltersForm = form(i18n, fields, currentField, notNullConstraintOrTrue, css, false);

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
