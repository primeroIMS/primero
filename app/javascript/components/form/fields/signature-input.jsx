import { FormControl, FormLabel, FormHelperText } from "@mui/material";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";
import { get } from "lodash";

import { AssetJwt } from "../../asset-jwt";
import { useI18n } from "../../i18n";
import { EMPTY_VALUE } from "../constants";

import css from "./styles.css";

function SignatureInput({ commonInputProps, metaInputProps, formMethods }) {
  const { label, helperText, name, error, required } = commonInputProps;
  const { signatureProvidedByLabel } = metaInputProps;

  const { control } = formMethods;
  const i18n = useI18n();

  const signatureInfo = (values, signatureMetaField) => {
    const fieldValue = values?.[signatureMetaField];

    if (!fieldValue) return false;
    const selectedLabelFromField = get(signatureProvidedByLabel, i18n.locale, null);
    const signatureLabel = selectedLabelFromField || i18n.t(`fields.${signatureMetaField}`);

    return (
      <div>
        {signatureLabel}: <span>{fieldValue || EMPTY_VALUE}</span>
      </div>
    );
  };

  return (
    <FormControl component="fieldset" error={error}>
      <FormLabel required={required} className={css.signatureLabel}>
        {label}
      </FormLabel>
      <Controller
        control={control}
        name={name}
        as={({ value }) => {
          const signature = value?.attachment_url;

          if (!signature) return null;

          return (
            <>
              <AssetJwt src={signature} className={css.signatureImage} />
              <div className={css.signatureDetails}>
                {signatureInfo(value, "signature_provided_on")}
                {signatureInfo(value, "signature_provided_by", "signatureProvidedByLabel")}
                {signatureInfo(value, "signature_created_by_user")}
              </div>
            </>
          );
        }}
        defaultValue={{}}
      />
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
}

SignatureInput.displayName = "SignatureInput";

SignatureInput.propTypes = {
  commonInputProps: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired,
  metaInputProps: PropTypes.object.isRequired
};

export default SignatureInput;
