import { useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { fromJS } from "immutable";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import CheckIcon from "@material-ui/icons/Check";

import {
  notPropagatedOnSubmit,
  whichFormMode,
  FormSection,
  SELECT_FIELD,
  TICK_FIELD,
  RADIO_FIELD,
  NUMERIC_FIELD,
  DATE_FIELD
} from "../../../../../form";
import ActionDialog, { useDialog } from "../../../../../action-dialog";
import { reduceMapToObject, useMemoizedSelector } from "../../../../../../libs";
import { useI18n } from "../../../../../i18n";
import { getFieldByName, getNestedFields, getRecordFields } from "../../../../../record-form/selectors";

import { conditionsForm, validationSchema } from "./form";
import { ATTRIBUTE_FIELD, CONSTRAINT_FIELD, EXCLUDED_FIELD_TYPES, FORM_NAME, NAME, VALUE_FIELD } from "./constants";
import { buildFieldName, convertValue, registerFields, updateCondition } from "./utils";

function Component({ formMethods, handleClose, handleSuccess, primeroModule, recordType, field }) {
  const i18n = useI18n();
  const { dialogOpen, params } = useDialog(NAME);
  const initialValues = params.get("initialValues", fromJS({}));
  const isNested = params.get("isNested", false);
  const fieldName = buildFieldName(field, isNested);

  const { append } = useFieldArray({ control: formMethods.control, name: fieldName });

  const currentConditions = formMethods.getValues(fieldName) || [];
  const isFirstCondition = parseInt(params.get("index"), 10) === 0 || currentConditions.length <= 0;
  const defaultValues = initialValues.size
    ? reduceMapToObject(initialValues)
    : { attribute: "", constraint: "", value: "" };
  const dialogFormMethods = useForm({ defaultValues, resolver: yupResolver(validationSchema(i18n, isFirstCondition)) });
  const { handleSubmit } = dialogFormMethods;
  const attribute = useWatch({ control: dialogFormMethods.control, name: ATTRIBUTE_FIELD });
  const selectedField = useMemoizedSelector(state => getFieldByName(state, attribute));
  const fieldsSelector = isNested ? getNestedFields : getRecordFields;
  const fields = useMemoizedSelector(state =>
    fieldsSelector(state, {
      recordType,
      primeroModule,
      excludeTypes: EXCLUDED_FIELD_TYPES,
      omitDuplicates: true,
      includeFormSectionName: true,
      ...(isNested
        ? {
            excludeFieldNames: field?.name ? [field.name] : null,
            nestedFormIds: field?.get("form_section_id") ? [field?.get("form_section_id")] : null
          }
        : { includeNested: false })
    })
  );

  const formMode = whichFormMode(params.get("mode"));

  const formSections = conditionsForm({
    fields,
    i18n,
    selectedField,
    mode: formMode,
    isFirstCondition
  });

  const onSubmit = data => {
    const dataConverted = { ...data, value: convertValue(data.value, selectedField.type) };

    if (formMode.isNew) {
      append(dataConverted);
    } else {
      registerFields({
        register: formMethods.register,
        fieldsRef: formMethods.control.fieldsRef.current,
        index: params.get("index"),
        fieldName
      });
      updateCondition({
        setValue: formMethods.setValue,
        index: params.get("index"),
        condition: dataConverted,
        fieldName
      });
    }

    if (handleClose) {
      handleClose();
    }

    if (handleSuccess) {
      handleSuccess();
    }
  };

  useEffect(() => {
    if (attribute && attribute !== defaultValues?.attribute && selectedField) {
      dialogFormMethods.setValue(CONSTRAINT_FIELD, "");
      if ([TICK_FIELD, SELECT_FIELD, RADIO_FIELD].includes(selectedField.type)) {
        dialogFormMethods.setValue(VALUE_FIELD, []);
      } else {
        dialogFormMethods.setValue(VALUE_FIELD, "");
      }
    }
  }, [attribute]);

  useEffect(() => {
    if (defaultValues.value) {
      const value = [DATE_FIELD, NUMERIC_FIELD].includes(selectedField?.type)
        ? defaultValues.value
        : [].concat(defaultValues.value);

      dialogFormMethods.setValue("value", value);
    }
  }, [selectedField?.type]);

  useEffect(() => {
    dialogFormMethods.reset(defaultValues);
  }, [JSON.stringify(defaultValues)]);

  return (
    <ActionDialog
      open={dialogOpen}
      confirmButtonLabel={formMode.isNew ? i18n.t("buttons.add") : i18n.t("buttons.update")}
      confirmButtonProps={{
        icon: <CheckIcon />,
        form: FORM_NAME,
        type: "submit"
      }}
      dialogTitle={formMode.isNew ? i18n.t("forms.conditions.add") : i18n.t("forms.conditions.update")}
      omitCloseAfterSuccess
      cancelHandler={handleClose}
    >
      <form noValidate id={FORM_NAME} onSubmit={notPropagatedOnSubmit(handleSubmit, onSubmit)}>
        {formSections.map(formSection => (
          <FormSection
            formSection={formSection}
            key={formSection.unique_id}
            formMode={formMode}
            formMethods={dialogFormMethods}
          />
        ))}
      </form>
    </ActionDialog>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  field: PropTypes.object,
  formMethods: PropTypes.object,
  handleClose: PropTypes.func,
  handleSuccess: PropTypes.func,
  primeroModule: PropTypes.string,
  recordType: PropTypes.string
};

export default Component;
