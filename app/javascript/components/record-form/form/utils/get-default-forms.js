// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import isEmpty from "lodash/isEmpty";

import {
  APPROVALS,
  CHANGE_LOGS,
  FAMILY_FROM_CASE,
  IDENTIFICATION_REGISTRATION,
  INCIDENT_FROM_CASE,
  MODULES,
  RECORD_INFORMATION_GROUP,
  RECORD_OWNER,
  RECORD_TYPES,
  REFERRAL,
  REGISTRY_FROM_CASE,
  SUMMARY,
  SUMMARY_INCIDENT_MRM,
  TRANSFERS_ASSIGNMENTS,
  INCIDENT_TRANSFERS_ASSIGNMENTS,
  CASE_RELATIONSHIPS
} from "../../../../config";
import generateKey from "../../../charts/table-values/utils";
import { FormSectionRecord } from "../../records";

export default (locale, query) => {
  const defaultForms = Object.freeze({
    [SUMMARY]: FormSectionRecord({
      id: generateKey(),
      unique_id: SUMMARY,
      description: {
        [locale]: "cases.summary.label"
      },
      name: {
        [locale]: "cases.summary.label"
      },
      is_first_tab: false,
      order: 9,
      order_form_group: 130,
      parent_form: RECORD_TYPES.cases,
      editable: true,
      module_ids: [MODULES.CP],
      form_group_id: "tracing",
      is_nested: false,
      subform_prevent_item_removal: false,
      collapsed_field_names: [],
      subform_append_only: false,
      initial_subforms: 0,
      i18nName: true,
      i18nDescription: true,
      visible: true
    }),
    [RECORD_OWNER]: FormSectionRecord({
      id: generateKey(),
      unique_id: RECORD_OWNER,
      name: { [locale]: "forms.record_types.record_information" },
      order: 1,
      form_group_id: RECORD_INFORMATION_GROUP,
      order_form_group: 0,
      is_first_tab: true,
      core_form: true,
      i18nName: true,
      visible: true
    }),
    [APPROVALS]: FormSectionRecord({
      id: generateKey(),
      unique_id: APPROVALS,
      name: { [locale]: "forms.record_types.approvals" },
      order: 2,
      form_group_id: RECORD_INFORMATION_GROUP,
      order_form_group: 0,
      is_first_tab: true,
      core_form: true,
      i18nName: true,
      visible: true,
      parent_form: RECORD_TYPES.cases
    }),
    [INCIDENT_FROM_CASE]: FormSectionRecord({
      id: generateKey(),
      unique_id: INCIDENT_FROM_CASE,
      name: { [locale]: "incidents.label" },
      order: 3,
      form_group_id: RECORD_INFORMATION_GROUP,
      order_form_group: 0,
      is_first_tab: false,
      core_form: true,
      i18nName: true,
      visible: true,
      parent_form: RECORD_TYPES.cases
    }),
    [REFERRAL]: FormSectionRecord({
      id: generateKey(),
      unique_id: REFERRAL,
      name: { [locale]: "forms.record_types.referrals" },
      order: 4,
      form_group_id: RECORD_INFORMATION_GROUP,
      order_form_group: 0,
      is_first_tab: true,
      core_form: true,
      i18nName: true,
      visible: true,
      parent_form: RECORD_TYPES.cases
    }),
    [TRANSFERS_ASSIGNMENTS]: FormSectionRecord({
      id: generateKey(),
      unique_id: TRANSFERS_ASSIGNMENTS,
      name: { [locale]: "forms.record_types.transfers_assignments" },
      order: 5,
      form_group_id: RECORD_INFORMATION_GROUP,
      order_form_group: 0,
      is_first_tab: false,
      core_form: true,
      i18nName: true,
      visible: true,
      parent_form: RECORD_TYPES.cases
    }),
    [INCIDENT_TRANSFERS_ASSIGNMENTS]: FormSectionRecord({
      id: generateKey(),
      unique_id: TRANSFERS_ASSIGNMENTS,
      name: { [locale]: "forms.record_types.transfers_assignments" },
      order: 5,
      form_group_id: RECORD_INFORMATION_GROUP,
      order_form_group: 0,
      is_first_tab: false,
      core_form: true,
      i18nName: true,
      visible: true,
      parent_form: RECORD_TYPES.incidents
    }),
    [CHANGE_LOGS]: FormSectionRecord({
      id: generateKey(),
      unique_id: CHANGE_LOGS,
      name: { [locale]: "change_logs.label" },
      order: 6,
      form_group_id: RECORD_INFORMATION_GROUP,
      order_form_group: 0,
      is_first_tab: false,
      core_form: true,
      i18nName: true,
      visible: true
    }),
    [REGISTRY_FROM_CASE]: FormSectionRecord({
      id: generateKey(),
      unique_id: REGISTRY_FROM_CASE,
      module_ids: [MODULES.CP],
      name: { [locale]: "forms.record_types.registry_details" },
      order: 2,
      form_group_id: IDENTIFICATION_REGISTRATION,
      fields: [],
      order_form_group: 1,
      is_first_tab: true,
      core_form: true,
      i18nName: true,
      visible: true,
      parent_form: RECORD_TYPES.cases
    }),
    [FAMILY_FROM_CASE]: FormSectionRecord({
      id: generateKey(),
      unique_id: FAMILY_FROM_CASE,
      module_ids: [MODULES.CP],
      name: { [locale]: "forms.record_types.family_record" },
      order: 3,
      form_group_id: IDENTIFICATION_REGISTRATION,
      fields: [],
      order_form_group: 1,
      is_first_tab: true,
      core_form: true,
      i18nName: true,
      visible: true,
      parent_form: RECORD_TYPES.cases
    }),
    [CASE_RELATIONSHIPS]: FormSectionRecord({
      id: generateKey(),
      unique_id: CASE_RELATIONSHIPS,
      name: { [locale]: "forms.record_types.case_relationships" },
      order: 4,
      form_group_id: RECORD_INFORMATION_GROUP,
      fields: [],
      order_form_group: 1,
      is_first_tab: true,
      core_form: true,
      i18nName: true,
      visible: true,
      parent_form: RECORD_TYPES.cases
    }),
    [SUMMARY_INCIDENT_MRM]: FormSectionRecord({
      id: generateKey(),
      unique_id: SUMMARY_INCIDENT_MRM,
      description: {
        [locale]: "incidents.summary_mrm.label"
      },
      name: {
        [locale]: "incidents.summary_mrm.label"
      },
      module_ids: [MODULES.MRM],
      is_first_tab: false,
      order: 1,
      order_form_group: 1,
      parent_form: RECORD_TYPES.incidents,
      form_group_id: "summary_of_the_incident",
      is_nested: false,
      i18nName: true,
      i18nDescription: true,
      core_form: true,
      visible: true
    })
  });

  if (query) {
    return Object.entries(defaultForms)
      .filter(
        ([, value]) =>
          (isEmpty(value.module_ids) && !value.parent_form) ||
          (!isEmpty(value.module_ids) && query.primeroModule && value.module_ids.includes(query.primeroModule)) ||
          (value.parent_form && query.recordType && value.parent_form === query.recordType)
      )
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }

  return defaultForms;
};
