/* eslint-disable react/display-name, react/prop-types */

import SearchableSelect from "../../../../searchable-select";

import searchTextFieldProps from "./search-text-field-props";
import searchableValue from "./searchable-value";

export default (searchField, props, disableControl, i18n) => {
  const { id, options } = searchField;
  const { field, form, ...other } = props;
  const handleChange = data => searchField.onChange(data, field, form);

  return (
    <SearchableSelect
      id={id}
      name={id}
      isDisabled={disableControl}
      options={options}
      defaultValues={searchableValue(field, options, disableControl, i18n)}
      onChange={handleChange}
      TextFieldProps={searchTextFieldProps(searchField, form, i18n)}
      {...other}
      onBlur={field.onBlur}
    />
  );
};
