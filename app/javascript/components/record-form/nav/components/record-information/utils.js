/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import { NavRecord } from "../../../records";
import { SHOW_APPROVALS, VIEW_INCIDENTS_FROM_CASE } from "../../../../../libs/permissions";
import { SHOW_CHANGE_LOG } from "../../../../permissions";
import {
  APPROVALS,
  CHANGE_LOGS,
  INCIDENT_FROM_CASE,
  RECORD_OWNER,
  RECORD_TYPES,
  REFERRAL,
  TRANSFERS_ASSIGNMENTS
} from "../../../../../config";

import { RECORD_INFORMATION_GROUP } from "./constants";

export const getRecordInformationForms = (i18n, recordType) =>
  fromJS([
    NavRecord({
      group: RECORD_INFORMATION_GROUP,
      groupName: i18n.t("forms.record_types.record_information"),
      groupOrder: 0,
      name: i18n.t("forms.record_types.record_information"),
      order: 0,
      formId: RECORD_OWNER,
      is_first_tab: true
    }),
    NavRecord({
      group: RECORD_INFORMATION_GROUP,
      groupName: i18n.t("forms.record_types.approvals"),
      groupOrder: 0,
      name: i18n.t("forms.record_types.approvals"),
      order: 1,
      formId: APPROVALS,
      is_first_tab: true,
      permission_actions: SHOW_APPROVALS
    }),
    NavRecord({
      group: RECORD_INFORMATION_GROUP,
      groupName: i18n.t("incidents.label"),
      groupOrder: 0,
      name: i18n.t("incidents.label"),
      order: 2,
      formId: INCIDENT_FROM_CASE,
      is_first_tab: false,
      permission_actions: VIEW_INCIDENTS_FROM_CASE,
      recordTypes: [RECORD_TYPES.cases]
    }),
    NavRecord({
      group: RECORD_INFORMATION_GROUP,
      groupName: i18n.t("forms.record_types.referrals"),
      groupOrder: 0,
      name: i18n.t("forms.record_types.referrals"),
      order: 3,
      formId: REFERRAL,
      is_first_tab: true
    }),
    NavRecord({
      group: RECORD_INFORMATION_GROUP,
      groupName: i18n.t("forms.record_types.record_information"),
      groupOrder: 0,
      name: i18n.t("forms.record_types.transfers_assignments"),
      order: 4,
      formId: TRANSFERS_ASSIGNMENTS,
      is_first_tab: false
    }),
    NavRecord({
      group: RECORD_INFORMATION_GROUP,
      groupName: i18n.t("forms.record_types.record_information"),
      groupOrder: 0,
      name: i18n.t("change_logs.label"),
      order: 5,
      formId: CHANGE_LOGS,
      permission_actions: SHOW_CHANGE_LOG,
      is_first_tab: false
    })
  ]).filter(form => !recordType || !form.get("recordTypes").length || form.get("recordTypes").includes(recordType));

export const getRecordInformationFormIds = (i18n, recordType) =>
  getRecordInformationForms(i18n, recordType).map(form => form.get("formId"));
