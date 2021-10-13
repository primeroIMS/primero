import {
  APPROVALS,
  CHANGE_LOGS,
  INCIDENT_FROM_CASE,
  MODULES,
  RECORD_INFORMATION_GROUP,
  RECORD_OWNER,
  RECORD_TYPES,
  REFERRAL,
  SUMMARY,
  TRANSFERS_ASSIGNMENTS
} from "../../../../config";
import generateKey from "../../../charts/table-values/utils";
import { FormSectionRecord } from "../../records";

export default locale =>
  Object.freeze({
    [SUMMARY]: FormSectionRecord({
      id: generateKey(),
      unique_id: SUMMARY,
      description: {
        [locale]: "cases.summary.label"
      },
      name: {
        [locale]: "cases.summary.label"
      },
      visible: true,
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
      i18nDescription: true
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
      i18nName: true
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
      i18nName: true
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
      i18nName: true
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
      i18nName: true
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
      i18nName: true
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
      i18nName: true
    })
  });
