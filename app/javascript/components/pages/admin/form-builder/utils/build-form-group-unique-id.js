// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (moduleId, parentForm) => {
  if (!moduleId || !parentForm) {
    return "";
  }

  const primeroModule = Array.isArray(moduleId) ? moduleId[0] : moduleId;

  return `lookup-form-group-${primeroModule?.replace("primeromodule-", "")}-${parentForm}`;
};
