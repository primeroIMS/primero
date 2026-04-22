import isEmpty from "lodash/isEmpty";

import { get } from "../../../../form/utils";

import getLookupFormGroup from "./get-lookup-form-group";

export default (allFormGroupsLookups, moduleId, parentForm) => {
  const formGroups = getLookupFormGroup(allFormGroupsLookups, moduleId, parentForm);

  if (!isEmpty(formGroups)) {
    return formGroups?.values?.reduce(
      (result, item) => [
        ...result,
        {
          id: item.id,
          display_text: get(item, "display_text", "")
        }
      ],
      []
    );
  }

  return [];
};
