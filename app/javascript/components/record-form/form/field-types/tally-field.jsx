import { connect, getIn } from "formik";
import { useEffect } from "react";
import { FormHelperText, InputLabel } from "@material-ui/core";
import PropTypes from "prop-types";
import compact from "lodash/compact";

import { useI18n } from "../../../i18n";
import { TALLY_FIELD_NAME } from "../constants";
import { displayNameHelper } from "../../../../libs";
import { NUMERIC_FIELD } from "../../constants";

import TextField from "./text-field";
import css from "./styles.css";

const TallyField = ({ name, formik, field, helperText, InputLabelProps, label, ...rest }) => {
  const i18n = useI18n();
  const totalName = `${name}.total`;

  const tallyValues = compact(field.tally.map(option => getIn(formik.values, [name, option.id])));

  const fieldProps = {
    variant: "outlined",
    autoComplete: "off",
    fullWidth: false
  };

  const renderAutosumTotal = Boolean(field.autosum_total) && (
    <TextField
      name={totalName}
      field={{ type: NUMERIC_FIELD }}
      label={i18n.t("fields.total")}
      {...fieldProps}
      {...rest}
      disabled
    />
  );

  const renderTallyFields = (
    <div className={css.inputTally}>
      {field.tally.map(option => {
        const labelField = displayNameHelper(option.display_text, i18n.locale);
        const currentFieldProps = {
          label: labelField,
          field: { type: NUMERIC_FIELD },
          name: `${name}.${option.id}`,
          ...fieldProps,
          ...rest
        };

        return <TextField {...currentFieldProps} />;
      })}
      {renderAutosumTotal}
    </div>
  );

  useEffect(() => {
    if (field.autosum_total) {
      const total = tallyValues.reduce((acc, value) => acc + value, 0);

      formik.setFieldValue(totalName, total === 0 ? "" : total);
    }
  }, [JSON.stringify(tallyValues)]);

  return (
    <div className={css.tallyContainer}>
      <InputLabel htmlFor={name} {...InputLabelProps}>
        {label}
      </InputLabel>
      {renderTallyFields}
      <FormHelperText>{helperText}</FormHelperText>
    </div>
  );
};

TallyField.displayName = TALLY_FIELD_NAME;

TallyField.propTypes = {
  field: PropTypes.object,
  formik: PropTypes.object,
  formSection: PropTypes.object,
  helperText: PropTypes.string,
  InputLabelProps: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string
};

export default connect(TallyField);
