import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";
import { memo } from "react";

import { FIELD_NAME_QUERY } from "./constants";
import SearchTextInput from "./search-text-input";
import SearchPhoneInput from "./search-phone-input";

function Component({ onInvalidNumber, phoneNumber = false }) {
  const { control } = useFormContext();

  if (phoneNumber) {
    return <SearchPhoneInput onInvalidNumber={onInvalidNumber} />;
  }

  return <Controller name={FIELD_NAME_QUERY} control={control} as={SearchTextInput} defaultValue="" />;
}

Component.displayName = "SearchInput";

Component.propTypes = {
  onInvalidNumber: PropTypes.func,
  phoneNumber: PropTypes.bool
};

export default memo(Component);
