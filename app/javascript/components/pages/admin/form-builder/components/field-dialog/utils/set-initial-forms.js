// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default subform => {
  if (subform) {
    return {
      ...subform,
      initial_subforms: subform.starts_with_one_entry ? 1 : 0
    };
  }

  return subform;
};
