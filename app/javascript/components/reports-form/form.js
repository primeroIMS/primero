/* eslint-disable camelcase */

import { fromJS } from "immutable";
import { object, string } from "yup";
import isEmpty from "lodash/isEmpty";

import {
  FieldRecord,
  FormSectionRecord,
  TICK_FIELD,
  TEXT_FIELD,
  TEXT_AREA,
  SELECT_FIELD
} from "../form";
import { dataToJS } from "../../libs";

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
import { buildFields, getFormName } from "./utils";

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
  allRecordForms
) => {
  // eslint-disable-next-line no-unused-vars
  const checkModuleField = (value, name, { methods }) => {
    const emptyModule = isEmpty(value[MODULES_FIELD]);

    if (name === RECORD_TYPE_FIELD) {
      const isModuleTouched = Object.keys(
        methods.control?.formState?.touched
      ).includes(MODULES_FIELD);

      if (isModuleTouched && emptyModule) {
        methods.reset({
          [MODULES_FIELD]: [],
          [RECORD_TYPE_FIELD]: [],
          [AGGREGATE_BY_FIELD]: [],
          [DISAGGREGATE_BY_FIELD]: [],
          [GROUP_AGES_FIELD]: false,
          [GROUP_DATES_BY_FIELD]: [],
          [IS_GRAPH_FIELD]: false
        });
      }
    }

    return { disabled: emptyModule };
  };

  const checkModuleAndRecordType = value => {
    const formName = getFormName(value[RECORD_TYPE_FIELD]);
    const formsByModuleAndRecordType = dataToJS(
      allRecordForms
    ).filter(formSection =>
      Array.isArray(value[MODULES_FIELD])
        ? formSection.module_ids.some(mod => value[MODULES_FIELD].includes(mod))
        : formSection.module_ids.includes(value[MODULES_FIELD])
    );

    const recordTypesForms = formsByModuleAndRecordType.filter(
      formSection => formSection.parent_form === value[RECORD_TYPE_FIELD]
    );
    const reportableForm = formsByModuleAndRecordType
      .filter(formSection => formSection.unique_id === formName)
      ?.toJS()?.[0]?.fields?.[0]?.subform_section_id;

    return {
      disabled:
        isEmpty(value[MODULES_FIELD]) || isEmpty(value[RECORD_TYPE_FIELD]),
      groupBy: "formSection",
      options: buildFields(
        formName ? reportableForm : recordTypesForms,
        i18n.locale,
        Boolean(formName)
      )
    };
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
          option_strings_source: "Module"
        }),
        FieldRecord({
          display_name: i18n.t("report.record_type"),
          name: RECORD_TYPE_FIELD,
          type: SELECT_FIELD,
          required: true,
          watchedInputs: [MODULES_FIELD],
          handleWatchedInputs: checkModuleField,
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
          watchedInputs: [MODULES_FIELD, RECORD_TYPE_FIELD],
          handleWatchedInputs: checkModuleAndRecordType
        }),
        FieldRecord({
          display_name: i18n.t("report.disaggregate_by"),
          name: DISAGGREGATE_BY_FIELD,
          type: SELECT_FIELD,
          multi_select: true,
          required: true,
          watchedInputs: [MODULES_FIELD, RECORD_TYPE_FIELD],
          handleWatchedInputs: checkModuleAndRecordType
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
          watchedInputs: [MODULES_FIELD],
          handleWatchedInputs: checkModuleField
        })
      ]
    })
  ]);
};
