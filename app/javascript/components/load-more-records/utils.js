// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

/* eslint-disable import/prefer-default-export */

export function hasMorePages(metadata) {
  if (!metadata.size) {
    return false;
  }

  return metadata.get("page") * metadata.get("per") < metadata.get("total");
}
