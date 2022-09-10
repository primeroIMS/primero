import { useCallback, useEffect } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import CheckIcon from "@material-ui/icons/Check";

import { whichFormMode, FormSection, SELECT_FIELD, TICK_FIELD, RADIO_FIELD } from "../../../../../form";
import ActionDialog, { useDialog } from "../../../../../action-dialog";
import { reduceMapToObject, useMemoizedSelector } from "../../../../../../libs";
import { useI18n } from "../../../../../i18n";
import { getFieldByName, getRecordFields } from "../../../../../record-form/selectors";
import { MODULES_FIELD, RECORD_TYPE_FIELD } from "../../constants";

import { conditionsForm, validationSchema } from "./form";
import { ATTRIBUTE_FIELD, CONSTRAINT_FIELD, FORM_NAME, NAME, VALUE_FIELD } from "./constants";
import { registerFields, updateCondition } from "./utils";

function Component({ formMethods, conditionsFieldName = "display_conditions" }) {
  const i18n = useI18n();
  const { append } = useFieldArray({ control: formMethods.control, name: conditionsFieldName });
  const { dialogOpen, dialogClose, params } = useDialog(NAME);
  const initialValues = reduceMapToObject(params.get("initialValues", {}));
  const dialogFormMethods = useForm({ defaultValues: initialValues, resolver: yupResolver(validationSchema(i18n)) });
  const { handleSubmit } = dialogFormMethods;
  const attribute = useWatch({ control: dialogFormMethods.control, name: ATTRIBUTE_FIELD });
  const constraint = useWatch({ control: dialogFormMethods.control, name: CONSTRAINT_FIELD });
  const recordType = useWatch({ control: formMethods.control, name: RECORD_TYPE_FIELD });
  const primeroModule = useWatch({ control: formMethods.control, name: MODULES_FIELD });
  const selectedField = useMemoizedSelector(state => getFieldByName(state, attribute));
  const fields = useMemoizedSelector(state =>
    getRecordFields(state, { recordType, primeroModule, includeNested: false, includeSeparators: false })
  );
  const formMode = whichFormMode(params.get("mode"));

  const handleClose = useCallback(() => {
    dialogClose();
  }, []);

  const formSections = conditionsForm({ fields, i18n, selectedField, isNotNullConstraint: constraint === "not_null" });

  const onSubmit = data => {
    if (formMode.isNew) {
      append(data);
    } else {
      registerFields({
        register: formMethods.register,
        fieldsRef: formMethods.control.fieldsRef.current,
        index: params.get("index"),
        conditionsFieldName
      });
      updateCondition({
        setValue: formMethods.setValue,
        index: params.get("index"),
        condition: data,
        conditionsFieldName
      });
    }
    handleClose();
  };

  useEffect(() => {
    if (attribute && attribute !== initialValues?.attribute && selectedField) {
      dialogFormMethods.setValue(CONSTRAINT_FIELD, "");
      if ([TICK_FIELD, SELECT_FIELD, RADIO_FIELD].includes(selectedField.type)) {
        dialogFormMethods.setValue(VALUE_FIELD, []);
      } else {
        dialogFormMethods.setValue(VALUE_FIELD, "");
      }
    }
  }, [attribute]);

  useEffect(() => {
    dialogFormMethods.reset(initialValues);
  }, [JSON.stringify(initialValues)]);

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
      <form id={FORM_NAME} onSubmit={handleSubmit(onSubmit)}>
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
  conditionsFieldName: PropTypes.string,
  formMethods: PropTypes.object
};

export default Component;
