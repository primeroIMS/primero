// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

export default (payload, defaultMetadata) => {
  if (payload.get("per") === null && payload.get("page") === null) {
    return payload.merge(defaultMetadata);
  }

  return payload;
};
