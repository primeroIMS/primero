import { fromJS } from "immutable";

import {
  FieldRecord,
  FormSectionRecord,
  CHECK_BOX_FIELD
} from "../../../../form";
import { RESOURCES, FORM_CHECK_ERRORS } from "../constants";

import { buildPermissionOptions } from "./utils";
import AssociatedRolesForm from "./associated-roles";

export default (resourceActions, roles, i18n) =>
  RESOURCES.filter(resource => resourceActions.has(resource)).map(resource => {
    const actions = (resourceActions || fromJS({})).get(resource, fromJS([]));

    if (resource === "role") {
      return AssociatedRolesForm(roles, actions, i18n);
    }

    return FormSectionRecord({
      unique_id: `resource_actions_${resource}`,
      name: i18n.t(`permissions.permission.${resource}`),
      fields: [
        FieldRecord({
          name: `permissions[${resource}]`,
          disabled: true,
          type: CHECK_BOX_FIELD,
          option_strings_text:
            buildPermissionOptions(actions, i18n)?.toJS() || []
        })
      ],
      expandable: true,
      expanded: true,
      check_errors: fromJS(FORM_CHECK_ERRORS)
    });
  });
