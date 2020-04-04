import { fromJS } from "immutable";

import {
  FieldRecord,
  FormSectionRecord,
  SELECT_FIELD,
  CHECK_BOX_FIELD
} from "../../../../form";

import { buildPermissionOptions } from "./utils";

export default (agencies, actions, i18n, formMode) => {
  return [
    FormSectionRecord({
      unique_id: "associated_agencies",
      fields: [
        FieldRecord({
          display_name: i18n.t("role.agency_ids_label"),
          name: "permissions[objects][agency]",
          type: SELECT_FIELD,
          multi_select: true,
          option_strings_text: agencies
            .map(agency => ({
              id: agency.get("unique_id"),
              display_text: agency.get("name")
            }))
            .toJS()
        })
      ]
    }),
    FormSectionRecord({
      unique_id: "agency_permissions",
      check_errors: fromJS(["permissions"]),
      fields: [
        FieldRecord({
          display_name: i18n.t(`permissions.permission.agency`),
          name: `permissions[agency]`,
          type: CHECK_BOX_FIELD,
          option_strings_text: buildPermissionOptions(actions, i18n).toJS()
        })
      ]
    })
  ];
};