import React from "react";

import { SearchableSelect } from "../../../../searchable-select";

import searchTextFieldProps from "./search-text-field-props";
import searchableValue from "./searchable-value";

export default (searchField, props, disableControl, i18n) => {
  const { id, options } = searchField;
  const { field, form, ...other } = props;

  return (
    <SearchableSelect
      id={id}
      isDisabled={disableControl}
      options={options}
      value={searchableValue(field, options, disableControl, i18n)}
      onChange={data => searchField.onChange(data, field, form)}
      TextFieldProps={searchTextFieldProps(searchField, form, i18n)}
      {...other}
      onBlur={field.onBlur}
    />
  );
};
