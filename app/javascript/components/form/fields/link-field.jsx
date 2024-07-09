// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { FormControl } from "@mui/material";
import { useWatch } from "react-hook-form";

import InputLabel from "../components/input-label";

import css from "./styles.css";

function LinkField({ commonInputProps, metaInputProps, formMethods }) {
  const { tooltip, href } = metaInputProps;
  const { name, label } = commonInputProps;
  const { control } = formMethods;

  const fieldValue = useWatch({ control, name });

  return (
    <FormControl id={name}>
      <div className={css.linkFieldLabel}>
        <InputLabel tooltip={tooltip} text={label} />
      </div>
      <NavLink to={`${href}`} className={css.linkField}>
        {fieldValue}
      </NavLink>
    </FormControl>
  );
}

LinkField.displayName = "LinkField";

LinkField.propTypes = {
  commonInputProps: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired,
  metaInputProps: PropTypes.object
};

export default LinkField;
