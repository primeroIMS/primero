// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import buildFormGroupUniqueId from "./build-form-group-unique-id";

export default (allFormGroupsLookups, moduleId, parentForm) => {
  if (!moduleId || !parentForm) {
    return {};
  }

  return allFormGroupsLookups.find(
    option => option.unique_id === buildFormGroupUniqueId(moduleId, parentForm.replace("_", "-"))
  );
};
