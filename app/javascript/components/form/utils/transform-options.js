// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { displayNameHelper } from "../../../libs";

import { get } from "./get";

export default (options, locale) => {
  return options.reduce((prev, current) => {
    const displayText = get(current, "display_text");

    return [
      ...prev,
      {
        ...current,
        id: get(current, "id"),
        display_text: displayNameHelper(displayText, locale) || displayText
      }
    ];
  }, []);
};
