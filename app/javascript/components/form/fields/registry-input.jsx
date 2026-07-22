import { useParams } from "react-router-dom";
import { useWatch } from "react-hook-form";
import PropTypes from "prop-types";
import InputLabel from "@mui/material/InputLabel";

import RegistrySummary from "../../registry-summary";

import HiddenInput from "./hidden-input";

function RegistryInput({ commonInputProps, formMethods }) {
  const { recordType } = useParams();

  const { control } = formMethods;
  const { name, label, disabled } = commonInputProps;
  const value = useWatch({ name, control });

  return (
    <>
      <InputLabel htmlFor={name} disabled={disabled}>
        {label}
      </InputLabel>
      <RegistrySummary value={value} recordType={recordType} disabled={disabled} />
      <HiddenInput commonInputProps={commonInputProps} formMethods={formMethods} />
    </>
  );
}

RegistryInput.displayName = "RegistryInput";

RegistryInput.propTypes = {
  commonInputProps: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired
};

export default RegistryInput;
