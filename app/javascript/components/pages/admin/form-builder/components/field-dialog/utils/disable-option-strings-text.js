import isEmpty from "lodash/isEmpty";

import { SELECT_FIELD, RADIO_FIELD } from "../../../../../../form";

export default (selectedField, fieldData, optionStringsText) => {
  if (![RADIO_FIELD, SELECT_FIELD].includes(selectedField.get("type")) || !fieldData.option_strings_text) {
    return [];
  }

  return fieldData.option_strings_text.map(option => {
    if (!isEmpty(optionStringsText)) {
      return { ...option, disabled: !optionStringsText.find(({ id }) => option.id === id)?.disabled };
    }

    return option;
  });
};
