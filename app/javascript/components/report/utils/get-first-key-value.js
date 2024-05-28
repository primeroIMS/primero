// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (object, excludeKey) => {
  const keys = Object.keys(object);

  if (keys.length > 1) {
    return object[keys.filter(key => key !== excludeKey)[0]];
  }

  return object;
};
