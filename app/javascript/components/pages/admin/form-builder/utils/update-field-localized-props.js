// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import isEmpty from "lodash/isEmpty";

import { FIELD_TRANSLATABLE_OPTIONS, LOCALIZABLE_OPTIONS_FIELD_NAME } from "../components/field-dialog/constants";

export default (selectedField, fieldData) =>
  FIELD_TRANSLATABLE_OPTIONS.reduce((acc, prop) => {
    const propValue = fieldData[prop];

    if (isEmpty(propValue)) {
      return acc;
    }

    if (Object.values(LOCALIZABLE_OPTIONS_FIELD_NAME).includes(prop)) {
      const currentOptions = acc.get(prop, fromJS([]));

      return acc.set(
        prop,
        currentOptions.map(option => {
          const newOption = propValue.find(current => current.id === option.get("id"));

          if (newOption) {
            const displayText = option.get("display_text").merge(fromJS(newOption.display_text));

            return option.set("display_text", displayText);
          }

          return option;
        })
      );
    }

    return acc.set(prop, acc.get(prop, fromJS({})).merge(fromJS(propValue)));
  }, selectedField);
