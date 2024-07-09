// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

export const showId = flag => {
  if (flag && flag.get("name") === null) {
    return true;
  }

  return typeof flag !== "undefined" && (flag.get("name").match(/\*/g) || []).length === 7;
};
