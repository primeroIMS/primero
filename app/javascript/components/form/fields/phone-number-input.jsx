// Copyright (c) 2014 - 2026 UNICEF. All rights reserved.

import { useState } from "react";
import PropTypes from "prop-types";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import { FormHelperText } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";

import { useMemoizedSelector } from "../../../libs";
import { useI18n } from "../../i18n";
import PhoneTextInput from "../../record-form/form/field-types/phone-text-input";
import { getDefaultPhoneFormat, getPhoneFormats } from "../../application";

function PhoneNumberInput({ commonInputProps, formMethods }) {
  const i18n = useI18n();
  const defaultPhoneformat = useMemoizedSelector(state => getDefaultPhoneFormat(state));
  const phoneFormats = useMemoizedSelector(state => getPhoneFormats(state));
  const [fieldError, setFieldError] = useState(null);
  const { control } = formMethods;
  const defaultCountry = defaultPhoneformat || phoneFormats.first();

  const { name, label, disabled } = commonInputProps;

  const validatePhoneNumber = value => {
    if (value) {
      if (isPossiblePhoneNumber(value)) {
        setFieldError(null);
      } else {
        setFieldError(i18n.t("phone_number.invalid"));
      }
    } else {
      setFieldError(null);
    }
  };

  const onPhoneChange = value => {
    validatePhoneNumber(value);
  };

  const warningStyle = fieldError ? { color: "var(--c-tia-maria)" } : {};

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
