// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { connect, getIn } from "formik";
import { useEffect } from "react";
import { FormHelperText, InputLabel } from "@mui/material";
import PropTypes from "prop-types";
import compact from "lodash/compact";

import { TALLY_FIELD_NAME } from "../constants";
import { buildTallyErrors } from "../utils";

import TallyFieldContainer from "./tally-field-container";
import css from "./styles.css";

function TallyField({ name, formik, field, helperText, InputLabelProps, label, mode, ...rest }) {
  const totalName = `${name}.total`;
  const tallyValues = compact(field.tally.map(option => getIn(formik.values, [name, option.id])));
  const errors = getIn(formik.errors, name);
  const touched = getIn(formik.touched, name);
  const hasError = errors && touched;
  const renderError = hasError && buildTallyErrors(errors);
  const renderErrorOnHelperText = hasError && { error: true };

  useEffect(() => {
    if (!mode.isShow && field.autosum_total) {
      const total = tallyValues.reduce((acc, value) => acc + value, 0);

      formik.setFieldValue(totalName, total === 0 ? "" : total);
    }
  }, [JSON.stringify(tallyValues)]);

  return (
    <div className={css.tallyContainer}>
      <InputLabel htmlFor={name} {...InputLabelProps} error={hasError}>
        {label}
      </InputLabel>
      <div className={css.inputTally} data-testid="tally-field">
        {field.tally.map(option => (
          <TallyFieldContainer name={`${name}.${option.id}`} option={option} error={hasError} {...rest} />
        ))}
        <TallyFieldContainer name={totalName} isTotal={field.autosum_total} {...rest} error={hasError} />
      </div>
      <FormHelperText {...renderErrorOnHelperText}>{renderError || helperText}</FormHelperText>
    </div>
  );
}

TallyField.displayName = TALLY_FIELD_NAME;

TallyField.propTypes = {
  field: PropTypes.object,
  formik: PropTypes.object,
  formSection: PropTypes.object,
  helperText: PropTypes.string,
  InputLabelProps: PropTypes.object,
  label: PropTypes.string,
  mode: PropTypes.object,
  name: PropTypes.string
};

export default connect(TallyField);
