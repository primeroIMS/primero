import { memo, useEffect } from "react";
import PropTypes from "prop-types";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";

import usePhoneInput from "../../../form/use-phone-input";

import { FIELD_NAME_QUERY } from "./constants";
import SearchTextInput from "./search-text-input";

function SearchPhoneInput({ formMethods, onInvalidNumber, ...rest }) {
  const { control } = formMethods;
  const { fieldError, onPhoneChange, defaultCountry, phoneFormats } = usePhoneInput();

  useEffect(() => {
    onInvalidNumber(fieldError);
  }, [fieldError]);

  return (
    <PhoneInputWithCountry
      name={FIELD_NAME_QUERY}
      control={control}
      error={!!fieldError}
      onChange={onPhoneChange}
      useNationalFormatForDefaultCountryValue={false}
      countryCallingCodeEditable={false}
      international
      addInternationalOption
      inputComponent={SearchTextInput}
      defaultCountry={defaultCountry}
      formMethods={formMethods}
      {...(phoneFormats.size > 0 ? { countries: phoneFormats } : {})}
      {...rest}
    />
  );
}

SearchPhoneInput.displayName = "SearchPhoneInput";

SearchPhoneInput.propTypes = {
  formMethods: PropTypes.object,
  onInvalidNumber: PropTypes.func.isRequired
};

export default memo(SearchPhoneInput);
