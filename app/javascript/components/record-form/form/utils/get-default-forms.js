import { MODULES, RECORD_TYPES, SUMMARY } from "../../../../config";
import generateKey from "../../../charts/table-values/utils";
import { FormSectionRecord } from "../../records";

export default i18n => ({
  [SUMMARY]: FormSectionRecord({
    id: generateKey(),
    unique_id: SUMMARY,
    description: {
      [i18n.locale]: i18n.t("cases.summary.label")
    },
    name: {
      [i18n.locale]: i18n.t("cases.summary.label")
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
    initial_subforms: 0
  })
});
