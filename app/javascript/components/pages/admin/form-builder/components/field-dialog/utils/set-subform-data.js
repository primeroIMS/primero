// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (field, subform) => {
  if (subform) {
    return {
      ...field,
      display_name: subform?.name
    };
  }

  return field;
};
