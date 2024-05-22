// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { List, Map } from "immutable";

const paramQueryString = (key, value) => {
  if (List.isList(value)) {
    return value.reduce((prev, elem, index) => {
      if (!prev) {
        return `${key}[${index}]=${elem}`;
      }

      return `${prev}&${key}[${index}]=${elem}`;
    }, "");
  }

  if (Map.isMap(value)) {
    return value.entrySeq().reduce((prev, [elemKey, elemValue]) => {
      if (!prev) {
        return `${key}[${elemKey}]=${elemValue}`;
      }

      return `${prev}&${key}[${elemKey}]=${elemValue}`;
    }, "");
  }

  return `${key}=${value}`;
};

export default filters =>
  filters.entrySeq().reduce((acc, [key, value]) => {
    const param = paramQueryString(key, value);

    if (!acc) {
      return `${acc}${param}`;
    }

    return `${acc}&${param}`;
  }, "");
