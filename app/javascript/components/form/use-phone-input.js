import { useState } from "react";
import { isPossiblePhoneNumber } from "react-phone-number-input";

import { useI18n } from "../i18n";
import { useMemoizedSelector } from "../../libs";
import { getDefaultPhoneFormat, getPhoneFormats } from "../application";

const DEFAULT_COUNTRY_CODE = "US";

export default function usePhoneInput() {
  const i18n = useI18n();
  const defaultPhoneformat = useMemoizedSelector(state => getDefaultPhoneFormat(state));
  const phoneFormats = useMemoizedSelector(state => getPhoneFormats(state));
  const [fieldError, setFieldError] = useState(null);
  const defaultCountry = defaultPhoneformat || phoneFormats.first() || DEFAULT_COUNTRY_CODE;

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

  return {
    fieldError,
    warningStyle,
    validatePhoneNumber,
    onPhoneChange,
    defaultCountry,
    phoneFormats
  };
}
