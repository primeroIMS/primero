import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { memo } from "react";

import { FIELD_NAME_QUERY } from "./constants";
import SearchTextInput from "./search-text-input";
import SearchPhoneInput from "./search-phone-input";

function Component({ formMethods, onInvalidNumber, isPhoneNumber = false, ...rest }) {
  if (isPhoneNumber) {
    return <SearchPhoneInput formMethods={formMethods} onInvalidNumber={onInvalidNumber} {...rest} />;
  }

  return (
    <Controller
      name={FIELD_NAME_QUERY}
      formMethods={formMethods}
      control={formMethods.control}
      as={SearchTextInput}
      defaultValue=""
      {...rest}
    />
  );
}

Component.displayName = "SearchInput";

Component.propTypes = {
  formMethods: PropTypes.object,
  isPhoneNumber: PropTypes.bool,
  onInvalidNumber: PropTypes.func
};

export default memo(Component);
