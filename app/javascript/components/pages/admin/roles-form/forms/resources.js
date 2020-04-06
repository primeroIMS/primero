import { fromJS } from "immutable";

import {
  FieldRecord,
  FormSectionRecord,
  CHECK_BOX_FIELD
} from "../../../../form";

import { buildPermissionOptions } from "./utils";

const permissionFields = (permissions, i18n) =>
  (permissions || fromJS({}))
    .keySeq()
    .toJS()
    .map(key =>
      FieldRecord({
        display_name: i18n.t(`permissions.permission.${key}`),
        name: `permissions[${key}]`,
        disabled: true,
        type: CHECK_BOX_FIELD,
        option_strings_text: buildPermissionOptions(
          permissions.get(key),
          i18n
        ).toJS()
      })
    );

export default (resourceActions, i18n) => {
  return FormSectionRecord({
    unique_id: "resource_actions",
    fields: permissionFields(resourceActions, i18n),
    check_errors: fromJS(["permissions"])
  });
};
