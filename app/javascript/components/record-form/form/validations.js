/* eslint-disable import/prefer-default-export */
import { number, date, array, object, string, bool, lazy } from "yup";
import { addDays } from "date-fns";
import compact from "lodash/compact";
import first from "lodash/first";

import {
  NUMERIC_FIELD,
  DATE_FIELD,
  DOCUMENT_FIELD,
  SUBFORM_SECTION,
  NOT_FUTURE_DATE,
  TICK_FIELD,
  SELECT_FIELD,
  TALLY_FIELD
} from "../constants";
import { parseExpression } from "../../../libs/expressions";

import { asyncFieldOffline } from "./utils";

const MAX_PERMITTED_INTEGER = 2147483647;

function conditionRelatedField(condition) {
  if (Array.isArray(condition)) {
    const [, firstCondition] = Object.entries(first(condition))[0];

    return conditionRelatedField(firstCondition);
  }

  const [relatedField] = Object.entries(condition)[0];

  return relatedField;
}

function conditionalFieldAttrs(conditions) {
  const [operator, condition] = Object.entries(conditions)[0];

  return {
    operator,
    condition,
    relatedField: conditionRelatedField(condition)
  };
}

export const fieldValidations = (field, { i18n, online = false }) => {
  const {
    multi_select: multiSelect,
    name,
    type,
    required,
    option_strings_source: optionStringsSource,
    display_conditions_subform: displayConditionsSubform,
    display_conditions_record: displayConditionsRecord
  } = field;
  const validations = {};

  if (field.visible === false || asyncFieldOffline(online, optionStringsSource)) {
    return validations;
  }

  if (NUMERIC_FIELD === type) {
    if (name.match(/.*age$/)) {
      validations[name] = number()
        .nullable()
        .transform(value => (Number.isNaN(value) ? null : value))
        .positive()
        .min(0, i18n.t("errors.models.child.age"))
        .max(130, i18n.t("errors.models.child.age"));
    } else {
      validations[name] = number()
        .nullable()
        .transform(value => (Number.isNaN(value) ? null : value))
        .min(0)
        .max(MAX_PERMITTED_INTEGER);
    }
  } else if (DATE_FIELD === type) {
    validations[name] = date().nullable();
    if (field.date_validation === NOT_FUTURE_DATE) {
      validations[name] = validations[name].max(addDays(new Date(), 1), i18n.t("fields.future_date_not_valid"));
    }
  } else if (SUBFORM_SECTION === type) {
    const subformSchema = field.subform_section_id.fields.map(sf => {
      return fieldValidations(sf, { i18n, online });
    });

    validations[name] = array().of(
      lazy(value => {
        return value._destroy ? object() : object().shape(Object.assign({}, ...subformSchema));
      })
    );
  } else if (TALLY_FIELD === type) {
    const initialKeys = field.autosum_total
      ? {
          total: number()
            .nullable()
            .transform(value => (Number.isNaN(value) ? null : value))
            .min(0)
            .max(MAX_PERMITTED_INTEGER)
        }
      : {};

    const tallySchema = field.tally.reduce((acc, option) => {
      return {
        ...acc,
        [option.id]: number()
          .nullable()
          .transform(value => (Number.isNaN(value) ? null : value))
          .min(0)
          .max(MAX_PERMITTED_INTEGER)
      };
    }, initialKeys);

    validations[name] = object().shape(tallySchema);
  }

  if (DOCUMENT_FIELD === type) {
    validations[name] = array().of(
      object().shape({
        attachment: string()
          .nullable()
          .when(["_destroy", "attachment_url"], {
            is: (destroy, attachmentUrl) => destroy !== 0 && !destroy && !attachmentUrl,
            then: string().nullable().required(i18n.t("fields.file_upload_box.no_file_selected"))
          })
      })
    );
  }

  if (required) {
    const requiredMessage = i18n.t("form_section.required_field", {
      field: field.display_name[i18n.locale]
    });

    switch (true) {
      case type === TICK_FIELD:
        validations[name] = bool().oneOf([true], requiredMessage);
        break;
      case type === SELECT_FIELD && multiSelect:
        validations[name] = array().min(1, requiredMessage);
        break;
      default:
        validations[name] = (validations[name] || string()).nullable();
        break;
    }

    const schema = validations[name] || string();

    if (displayConditionsSubform || displayConditionsRecord) {
      const { relatedField } = conditionalFieldAttrs(displayConditionsSubform || displayConditionsRecord);

      validations[name] = schema.when(relatedField, {
        is: relatedFieldValue => {
          return parseExpression(displayConditionsSubform || displayConditionsRecord).evaluate({
            [relatedField]: relatedFieldValue
          });
        },
        then:
          type !== TALLY_FIELD
            ? schema.required(requiredMessage)
            : currentSchema =>
                currentSchema.test(name, requiredMessage, value => {
                  return compact(Object.values(value)).length > 0;
                }),
        otherwise: type !== TALLY_FIELD ? schema.notRequired() : currentSchema => currentSchema.notRequired()
      });
    } else {
      if (!([TICK_FIELD, SELECT_FIELD, TALLY_FIELD].includes(type) || (type !== SELECT_FIELD && multiSelect))) {
        validations[name] = schema.nullable();
      }

      if (![TALLY_FIELD].includes(type)) {
        validations[name] = schema.required(requiredMessage);
      }

      if (type === TALLY_FIELD) {
        validations[name] = schema.test(name, requiredMessage, value => {
          return compact(Object.values(value)).length > 0;
        });
      }
    }
  }

  return validations;
};
