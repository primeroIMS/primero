import { memo, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";

import usePhoneInput from "../../../form/use-phone-input";

import { FIELD_NAME_QUERY } from "./constants";
import SearchTextInput from "./search-text-input";

function SearchPhoneInput({ onInvalidNumber }) {
  const { control } = useFormContext();
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
      {...(phoneFormats.size > 0 ? { countries: phoneFormats } : {})}
    />
  );
}

SearchPhoneInput.displayName = "SearchPhoneInput";

SearchPhoneInput.propTypes = {
  onInvalidNumber: PropTypes.func.isRequired
};

export default memo(SearchPhoneInput);
