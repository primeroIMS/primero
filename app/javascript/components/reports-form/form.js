/* eslint-disable camelcase */

import { fromJS } from "immutable";
import { object, string } from "yup";
import isEmpty from "lodash/isEmpty";

import { FieldRecord, FormSectionRecord, TICK_FIELD, TEXT_FIELD, TEXT_AREA, SELECT_FIELD, OPTION_TYPES } from "../form";

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
  DISABLED_FIELD,
  REPORTABLE_TYPES
} from "./constants";
import { buildUserModules, formattedFields } from "./utils";

export const validations = i18n =>
  object().shape({
    aggregate_by: string().required(),
    module_id: string().required(),
    name: object().shape({
      en: string().required(i18n.t("report.name_mandatory"))
    }),
    record_type: string().required().nullable()
  });

export const form = (i18n, ageHelpText, isNew, userModules) => {
  const checkModuleField = ({ [MODULES_FIELD]: modules }) => ({
    disabled: isNew && isEmpty(modules)
  });

  const checkModuleAndRecordType = ({ [MODULES_FIELD]: modules = [], [RECORD_TYPE_FIELD]: recordType }, options) =>
    formattedFields(options, modules, recordType, i18n.locale);

  const aggregateDefaults = {
    type: SELECT_FIELD,
    multi_select: true,
    required: true,
    groupBy: "formSection",
    watchedInputs: [MODULES_FIELD, RECORD_TYPE_FIELD],
    maxSelectedOptions: 2,
    option_strings_source: OPTION_TYPES.RECORD_FORMS,
    handleWatchedInputs: checkModuleField,
    filterOptionSource: (watchedInputValues, options) => {
      return checkModuleAndRecordType(watchedInputValues, options);
    }
  };

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
          option_strings_text: buildUserModules(userModules),
          clearDependentValues: [
            RECORD_TYPE_FIELD,
            [GROUP_AGES_FIELD, false],
            [IS_GRAPH_FIELD, false],
            [DISABLED_FIELD, false],
            [AGGREGATE_BY_FIELD, []],
            [DISAGGREGATE_BY_FIELD, []]
          ]
        }),
        FieldRecord({
          display_name: i18n.t("report.record_type"),
          name: RECORD_TYPE_FIELD,
          type: SELECT_FIELD,
          required: true,
          watchedInputs: [MODULES_FIELD],
          handleWatchedInputs: checkModuleField,
          clearDependentValues: [
            [AGGREGATE_BY_FIELD, []],
            [DISAGGREGATE_BY_FIELD, []]
          ],
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
          ...aggregateDefaults
        }),
        FieldRecord({
          display_name: i18n.t("report.disaggregate_by"),
          name: DISAGGREGATE_BY_FIELD,
          ...aggregateDefaults
        }),
        FieldRecord({
          display_name: i18n.t("report.group_ages"),
          name: GROUP_AGES_FIELD,
          type: TICK_FIELD,
          watchedInputs: [MODULES_FIELD],
          handleWatchedInputs: checkModuleField,
          help_text: ageHelpText
        }),
        FieldRecord({
          display_name: i18n.t("report.group_dates_by"),
          name: GROUP_DATES_BY_FIELD,
          type: SELECT_FIELD,
          watchedInputs: [MODULES_FIELD],
          handleWatchedInputs: checkModuleField,
          option_strings_text: ["date", "week", "month", "year"].map(dateRange => ({
            id: dateRange,
            display_text: i18n.t(`report.date_ranges.${dateRange}`)
          }))
        }),
        FieldRecord({
          display_name: i18n.t("report.is_graph"),
          name: IS_GRAPH_FIELD,
          type: TICK_FIELD,
          watchedInputs: [MODULES_FIELD],
          handleWatchedInputs: checkModuleField
        }),
        FieldRecord({
          display_name: i18n.t("report.disabled.label"),
          name: DISABLED_FIELD,
          type: TICK_FIELD,
          tooltip: i18n.t("report.disabled.explanation")
        })
      ]
    })
  ]);
};
