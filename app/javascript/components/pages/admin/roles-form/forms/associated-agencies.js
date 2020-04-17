import { fromJS } from "immutable";

import {
  FieldRecord,
  FormSectionRecord,
  CHECK_BOX_FIELD
} from "../../../../form";

import { buildPermissionOptions } from "./utils";

export default (agencies, actions, i18n) => {
  return [
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
