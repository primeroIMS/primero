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
  TEXT_FIELD,
  TEXT_AREA,
  SEPARATOR,
  NUMERIC_FIELD,
  DATE_FIELD
} from "../../../../../form";
import ActionDialog, { useDialog } from "../../../../../action-dialog";
import { reduceMapToObject, useMemoizedSelector } from "../../../../../../libs";
import { useI18n } from "../../../../../i18n";
import { getFieldByName, getNestedFields, getRecordFields } from "../../../../../record-form/selectors";

import { conditionsForm, validationSchema } from "./form";
import { ATTRIBUTE_FIELD, CONSTRAINT_FIELD, FORM_NAME, NAME, VALUE_FIELD } from "./constants";
import { convertValue, registerFields, updateCondition } from "./utils";

function Component({ formMethods, handleClose, handleSuccess, primeroModule, recordType, field }) {
  const i18n = useI18n();
  const { append: appendConditionRecord } = useFieldArray({
    control: formMethods.control,
    name: field ? `${field.get("name")}.display_conditions_record` : "display_conditions"
  });
  const { append: appendConditionSubform } = useFieldArray({
    control: formMethods.control,
    name: field ? `${field.get("name")}.display_conditions_subform` : "display_conditions_subform"
  });

  const { dialogOpen, params } = useDialog(NAME);
  const initialValues = params.get("initialValues", fromJS({}));
  const defaultValues = initialValues.size
    ? reduceMapToObject(initialValues)
    : { attribute: "", constraint: "", value: "" };
  const dialogFormMethods = useForm({ defaultValues, resolver: yupResolver(validationSchema(i18n)) });
  const { handleSubmit } = dialogFormMethods;
  const attribute = useWatch({ control: dialogFormMethods.control, name: ATTRIBUTE_FIELD });
  const selectedField = useMemoizedSelector(state => getFieldByName(state, attribute));
  const nestedFields = useMemoizedSelector(state =>
    getNestedFields(state, {
      recordType,
      primeroModule,
      excludeTypes: [SEPARATOR, TEXT_FIELD, TEXT_AREA],
      omitDuplicates: true,
      excludeFieldNames: field?.name ? [field.name] : null,
      nestedFormIds: field?.get("form_section_id") ? [field?.get("form_section_id")] : null
    })
  );

  const fields = useMemoizedSelector(state =>
    getRecordFields(state, {
      recordType,
      primeroModule,
      includeNested: false,
      excludeTypes: [SEPARATOR, TEXT_FIELD, TEXT_AREA],
      omitDuplicates: true
    })
  );
  const formMode = whichFormMode(params.get("mode"));

  const formSections = conditionsForm({
    fields: fields.concat(nestedFields),
    i18n,
    selectedField,
    mode: formMode
  });

  const onSubmit = data => {
    const isNestedField = nestedFields.some(nested => nested.name === data.attribute);
    const conditionsFieldName = isNestedField ? "display_conditions_subform" : "display_conditions_record";
    const fieldName = field ? `${field.get("name")}.${conditionsFieldName}` : "display_conditions";
    const dataConverted = { ...data, value: convertValue(data.value, selectedField.type) };

    if (formMode.isNew) {
      if (isNestedField) {
        appendConditionSubform(dataConverted);
      } else {
        appendConditionRecord(dataConverted);
      }
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
      dialogTitle={i18n.t("forms.conditions.add")}
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
