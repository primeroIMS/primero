import buildFormGroupUniqueId from "./build-form-group-unique-id";

export default (allFormGroupsLookups, moduleId, parentForm) => {
  if (!moduleId || !parentForm) {
    return {};
  }

  return allFormGroupsLookups.find(
    option => option.unique_id === buildFormGroupUniqueId(moduleId, parentForm.replace("_", "-"))
  );
};
