/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

import { NavRecord } from "../../../records";
import { SHOW_APPROVALS, VIEW_INCIDENTS_FROM_CASE } from "../../../../../libs/permissions";
import { SHOW_CHANGE_LOG } from "../../../../permissions";
import { APPROVALS, CHANGE_LOGS, INCIDENT_FROM_CASE, RECORD_TYPES } from "../../../../../config";
import { getRecordInformationForms } from "../../../form/utils";

export const getRecordInformationNav = (i18n, recordType) => {
  const forms = Object.values(getRecordInformationForms(i18n));
  const perrmissionActions = {
    [INCIDENT_FROM_CASE]: VIEW_INCIDENTS_FROM_CASE,
    [CHANGE_LOGS]: SHOW_CHANGE_LOG,
    [APPROVALS]: SHOW_APPROVALS
  };

  return fromJS(
    forms
      .map(form =>
        NavRecord({
          group: form.form_group_id,
          groupName: i18n.t("forms.record_types.record_information"),
          groupOrder: form.order_form_group,
          name: form.getIn(["name", i18n.locale], ""),
          order: form.order,
          formId: form.unique_id,
          is_first_tab: form.is_first_tab,
          permission_actions: perrmissionActions[form.unique_id],
          ...(INCIDENT_FROM_CASE === form.unique_id ? { recordTypes: [RECORD_TYPES.cases] } : {})
        })
      )
      .filter(nav => !recordType || !nav.get("recordTypes").length || nav.get("recordTypes").includes(recordType))
  );
};

export const getRecordInformationFormIds = (i18n, recordType) =>
  getRecordInformationNav(i18n, recordType).map(form => form.get("formId"));
