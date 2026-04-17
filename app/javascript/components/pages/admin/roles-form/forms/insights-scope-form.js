import { fromJS } from "immutable";

import { FieldRecord, FormSectionRecord, SELECT_FIELD, CHECK_BOX_FIELD } from "../../../../form";
import { FORM_CHECK_ERRORS } from "../constants";
import { MANAGED_REPORT_SCOPE } from "../../../../permissions/constants";

import { buildPermissionOptions } from "./utils";

export default (actions, i18n) =>
  FormSectionRecord({
    unique_id: "insights_scope_form",
    name: i18n.t(`permissions.permission.managed_report`),
    expandable: true,
    expanded: true,
    check_errors: fromJS(FORM_CHECK_ERRORS),
    fields: [
      FieldRecord({
        display_name: i18n.t("permissions.resource.managed_report.actions.managed_report_scope.label"),
        name: "permissions.objects.managed_report.scope",
        type: SELECT_FIELD,
        option_strings_text: [
          {
            id: MANAGED_REPORT_SCOPE.ALL,
            display_text: i18n.t("permissions.resource.managed_report.actions.managed_report_scope_all.label")
          },
          {
            id: MANAGED_REPORT_SCOPE.AGENCY,
            display_text: i18n.t("permissions.resource.managed_report.actions.managed_report_scope_agency.label")
          },
          {
            id: MANAGED_REPORT_SCOPE.GROUP,
            display_text: i18n.t("permissions.resource.managed_report.actions.managed_report_scope_group.label")
          }
        ]
      }),
      FieldRecord({
        name: `permissions[managed_report]`,
        type: CHECK_BOX_FIELD,
        option_strings_text: buildPermissionOptions(actions, i18n, "managed_report")
      })
    ]
  });
