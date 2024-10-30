import { useMemo } from "react";
import { object } from "yup";

import { RECORD_TYPES } from "../../../config";
import { useMemoizedSelector } from "../../../libs";
import { getSubFormForFieldName } from "../../record-form/selectors";
import displayConditionsEnabled from "../../record-form/form/utils/display-conditions-enabled";
import { parseExpression } from "../../../libs/expressions";
import getDisplayConditions from "../../record-form/form/utils/get-display-conditions";
import { fieldValidations } from "../../record-form/form/validations";
import { useApp } from "../../application";
import { useI18n } from "../../i18n";

const HIDDEN_FIELD_NAMES = ["note_date", "note_created_by"];
const NOTES_SUBFORM_FIELD = "notes_section";

export default ({ recordType, primeroModule }) => {
  const i18n = useI18n();
  const { online } = useApp();

  const notesSubform = useMemoizedSelector(state =>
    getSubFormForFieldName(state, {
      recordType: RECORD_TYPES[recordType],
      primeroModule,
      fieldName: NOTES_SUBFORM_FIELD,
      checkVisible: false
    })
  );

  const formSection = useMemo(() => {
    const fields = notesSubform?.fields?.map(field => {
      if (HIDDEN_FIELD_NAMES.includes(field.name)) {
        return field.merge({ visible: false });
      }

      if (displayConditionsEnabled(field.display_conditions_subform)) {
        return field.merge({
          watchedInputs: notesSubform.fields
            .filter(subformField => !HIDDEN_FIELD_NAMES.includes(subformField.name))
            .map(watchedField => watchedField.name),
          showIf: values => parseExpression(getDisplayConditions(field.display_conditions_subform)).evaluate(values)
        });
      }

      return field;
    });

    return notesSubform?.set("fields", fields);
  }, [notesSubform]);

  const validationSchema = useMemo(
    () =>
      object().shape(
        formSection?.fields
          ?.filter(field => !field.disabled)
          ?.reduce((acc, field) => ({ ...acc, ...fieldValidations(field, { i18n, online }) }), {})
      ),
    [formSection]
  );

  return { validationSchema, formSection };
};
