// Copyright (c) 2014 - 2026 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import { FormHelperText } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";

import PhoneTextInput from "../../record-form/form/field-types/phone-text-input";
import usePhoneInput from "../use-phone-input";

function PhoneNumberInput({ commonInputProps, formMethods }) {
  const { fieldError, warningStyle, onPhoneChange, defaultCountry, phoneFormats } = usePhoneInput();
  const { control } = formMethods;

  const { name, label, disabled } = commonInputProps;

  return (
    <>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <PhoneInputWithCountry
        name={name}
        control={control}
        fieldError={fieldError}
        onChange={onPhoneChange}
        useNationalFormatForDefaultCountryValue={false}
        countryCallingCodeEditable={false}
        international
        addInternationalOption
        disabled={disabled}
        inputComponent={PhoneTextInput}
        defaultCountry={defaultCountry}
        {...(phoneFormats.size > 0 ? { countries: phoneFormats } : {})}
      />
      {fieldError && <FormHelperText sx={warningStyle}>{fieldError}</FormHelperText>}
    </>
  );
}

PhoneNumberInput.displayName = "PhoneNumberInput";

PhoneNumberInput.propTypes = {
  commonInputProps: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired
};

export default PhoneNumberInput;
