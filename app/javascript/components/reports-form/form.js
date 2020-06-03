import { fromJS } from "immutable";
import { object, string } from "yup";

import {
  FieldRecord,
  FormSectionRecord,
  TICK_FIELD,
  TEXT_FIELD,
  TEXT_AREA,
  SELECT_FIELD
} from "../form";

import {
  NAME_FIELD,
  DESCRIPTION_FIELD,
  MODULES_FIELD,
  RECORD_TYPE_FIELD,
  AGGREGATE_BY_FIELD,
  DISAGGREGATE_BY_FIELD,
  GROUP_AGES_FIELD,
  GROUP_DATES_BY_FIELD,
  IS_GRAPH_FIELD,
  REPORTABLE_TYPES
} from "./constants";

export const validations = i18n =>
  object().shape({
    aggregate_by: string().required(),
    module_id: string().required(),
    name: object().shape({
      en: string().required(i18n.t("report.name_mandatory"))
    }),
    record_type: string().required().nullable()
  });

export const form = (
  i18n,
  disabledByModule,
  disabledByModuleAndRecordType,
  ageHelpText,
  fields
) => {
  return fromJS([
    FormSectionRecord({
      unique_id: "reports",
      fields: [
        FieldRecord({
          display_name: i18n.t("report.name"),
          name: NAME_FIELD,
          type: TEXT_FIELD,
          required: true,
          autoFocus: true
        }),
        FieldRecord({
          display_name: i18n.t("report.description"),
          name: DESCRIPTION_FIELD,
          type: TEXT_AREA
        }),
        FieldRecord({
          display_name: i18n.t("report.modules"),
          name: MODULES_FIELD,
          type: SELECT_FIELD,
          required: true,
          multi_select: true,
          option_strings_source: "Module"
        }),
        FieldRecord({
          display_name: i18n.t("report.record_type"),
          name: RECORD_TYPE_FIELD,
          type: SELECT_FIELD,
          required: true,
          disabled: disabledByModule,
          option_strings_text: Object.entries(REPORTABLE_TYPES).map(item => {
            const [id] = item;

            return {
              id,
              display_text: i18n.t(`forms.record_types.${id}`)
            };
          })
        }),
        FieldRecord({
          display_name: i18n.t("report.aggregate_by"),
          name: AGGREGATE_BY_FIELD,
          type: SELECT_FIELD,
          multi_select: true,
          required: true,
          disabled: disabledByModuleAndRecordType,
          groupBy: "formSection",
          option_strings_text: fields
        }),
        FieldRecord({
          display_name: i18n.t("report.disaggregate_by"),
          name: DISAGGREGATE_BY_FIELD,
          type: SELECT_FIELD,
          multi_select: true,
          required: true,
          disabled: disabledByModuleAndRecordType,
          groupBy: "formSection",
          option_strings_text: fields
        }),
        FieldRecord({
          display_name: i18n.t("report.group_ages"),
          name: GROUP_AGES_FIELD,
          type: TICK_FIELD,
          disabled: disabledByModule,
          help_text: ageHelpText
        }),
        FieldRecord({
          display_name: i18n.t("report.group_dates_by"),
          name: GROUP_DATES_BY_FIELD,
          type: SELECT_FIELD,
          disabled: disabledByModule,
          option_strings_text: ["date", "week", "month", "year"].map(
            dateRange => ({
              id: dateRange,
              display_text: i18n.t(`report.date_ranges.${dateRange}`)
            })
          )
        }),
        FieldRecord({
          display_name: i18n.t("report.is_graph"),
          name: IS_GRAPH_FIELD,
          type: TICK_FIELD,
          disabled: disabledByModule
        })
      ]
    })
  ]);
};
