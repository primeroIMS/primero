// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (field, keys, locale) => {
  if (field.type !== "dates") {
    return false;
  }

  const datesOption = field?.options?.[locale];

  if (!datesOption) {
    return false;
  }

  return datesOption?.filter(dateOption => keys.includes(dateOption.id))?.length > 0;
};
