import {
  APPROVALS,
  CHANGE_LOGS,
  INCIDENT_FROM_CASE,
  RECORD_INFORMATION_GROUP,
  RECORD_OWNER,
  REFERRAL,
  TRANSFERS_ASSIGNMENTS
} from "../../../../config";
import generateKey from "../../../charts/table-values/utils";
import { FormSectionRecord } from "../../records";

export default i18n =>
  Object.freeze({
    [RECORD_OWNER]: FormSectionRecord({
      id: generateKey(),
      unique_id: RECORD_OWNER,
      name: { [i18n.locale]: i18n.t("forms.record_types.record_information") },
      order: 1,
      form_group_id: RECORD_INFORMATION_GROUP,
      order_form_group: 0,
      is_first_tab: true
    }),
    [APPROVALS]: FormSectionRecord({
      id: generateKey(),
      unique_id: APPROVALS,
      name: { [i18n.locale]: i18n.t("forms.record_types.approvals") },
      order: 2,
      form_group_id: RECORD_INFORMATION_GROUP,
      order_form_group: 0,
      is_first_tab: true
    }),
    [INCIDENT_FROM_CASE]: FormSectionRecord({
      id: generateKey(),
      unique_id: INCIDENT_FROM_CASE,
      name: { [i18n.locale]: i18n.t("incidents.label") },
      order: 3,
      form_group_id: RECORD_INFORMATION_GROUP,
      order_form_group: 0,
      is_first_tab: false
    }),
    [REFERRAL]: FormSectionRecord({
      id: generateKey(),
      unique_id: REFERRAL,
      name: { [i18n.locale]: i18n.t("forms.record_types.referrals") },
      order: 4,
      form_group_id: RECORD_INFORMATION_GROUP,
      order_form_group: 0,
      is_first_tab: true
    }),
    [TRANSFERS_ASSIGNMENTS]: FormSectionRecord({
      id: generateKey(),
      unique_id: TRANSFERS_ASSIGNMENTS,
      name: { [i18n.locale]: i18n.t("forms.record_types.transfers_assignments") },
      order: 5,
      form_group_id: RECORD_INFORMATION_GROUP,
      order_form_group: 0,
      is_first_tab: false
    }),
    [CHANGE_LOGS]: FormSectionRecord({
      id: generateKey(),
      unique_id: CHANGE_LOGS,
      name: { [i18n.locale]: i18n.t("change_logs.label") },
      order: 6,
      form_group_id: RECORD_INFORMATION_GROUP,
      order_form_group: 0,
      is_first_tab: false
    })
  });
