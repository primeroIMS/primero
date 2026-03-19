import { useState } from "react";
import PropTypes from "prop-types";
import { connect, FastField } from "formik";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import ar from "react-phone-number-input/locale/ar";
import en from "react-phone-number-input/locale/en";
import es from "react-phone-number-input/locale/es";
import it from "react-phone-number-input/locale/it";
import fr from "react-phone-number-input/locale/fr";
import pt from "react-phone-number-input/locale/pt";
import ru from "react-phone-number-input/locale/ru";
import sk from "react-phone-number-input/locale/sk";
import th from "react-phone-number-input/locale/th";
import ua from "react-phone-number-input/locale/ua";
import isNil from "lodash/isNil";
import first from "lodash/first";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";

import { useI18n } from "../../../i18n";
import { shouldFieldUpdate } from "../utils";
import { useMemoizedSelector } from "../../../../libs";
import { getDefaultPhoneFormat, getPhoneFormats } from "../../../application";

import PhoneTextInput from "./phone-text-input";

const LOCALIZED_COUNTRY_LABELS = { ar, en, es, it, fr, pt, ru, sk, th, ua };

function PhoneField({ name, field, formik, mode, recordType, recordID, formSection, ...rest }) {
  const i18n = useI18n();
  const defaultPhoneformat = useMemoizedSelector(state => getDefaultPhoneFormat(state));
  const phoneFormats = useMemoizedSelector(state => getPhoneFormats(state));
  const [fieldError, setFieldError] = useState(null);

  const baseLocale = first(i18n.locale.split("-"));
  const countryLabels = LOCALIZED_COUNTRY_LABELS[baseLocale] || en;

  const { label, disabled, placeholder, autoComplete } = rest;

  const inputPlaceholder = mode.isShow ? placeholder : i18n.t("phone_number.placeholder");
  const defaultCountry = mode.isShow ? null : defaultPhoneformat || phoneFormats.first();

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

    return formik.setFieldValue(name, value || "", false);
  };

  const warningStyle = fieldError ? { color: "var(--c-tia-maria)" } : {};

  return (
    <FastField name={name} shouldUpdate={shouldFieldUpdate} locale={i18n.locale}>
      {renderProps => {
        const fieldValue = isNil(renderProps.field.value) ? "" : renderProps.field.value;
        const countryComponent = mode.isShow && !fieldValue ? { countrySelectComponent: () => <></> } : {};

        return (
          <>
            <InputLabel htmlFor={name} sx={warningStyle}>
              {label}
            </InputLabel>
            <PhoneInput
              id={name}
              autoComplete={autoComplete}
              data-testid="phone-field"
              labels={countryLabels}
              placeholder={inputPlaceholder}
              value={fieldValue}
              fieldError={fieldError}
              disabled={disabled}
              useNationalFormatForDefaultCountryValue={false}
              countryCallingCodeEditable={false}
              onChange={onPhoneChange}
              inputComponent={PhoneTextInput}
              defaultCountry={defaultCountry}
              international
              addInternationalOption
              {...(phoneFormats.size > 0 ? { countries: phoneFormats } : {})}
              {...countryComponent}
            />
            {fieldError && <FormHelperText sx={warningStyle}>{fieldError}</FormHelperText>}
          </>
        );
      }}
    </FastField>
  );
}

PhoneField.propTypes = {
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  formSection: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  recordID: PropTypes.string,
  recordType: PropTypes.string.isRequired,
  rest: PropTypes.object
};

PhoneField.displayName = "PhoneField";

export default connect(PhoneField);
