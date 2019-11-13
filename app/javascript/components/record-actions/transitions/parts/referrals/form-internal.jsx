import React from "react";
import PropTypes from "prop-types";
import { Field } from "formik";
import { TextField } from "formik-material-ui";

import { useI18n } from "../../../../i18n";
import { SearchableSelect } from "../../../../searchable-select";

const FormInternal = ({ fields, disabled }) => {
  const i18n = useI18n();
  const internalFields = fields.map(f => {
    if (!Object.keys(f).includes("options")) {
      return (
        <Field
          key={f.id}
          component={TextField}
          name={f.id}
          label={f.label}
          margin="normal"
          disabled={disabled}
          InputLabelProps={{
            shrink: true
          }}
          fullWidth
        />
      );
    }
    const searchableValue = field => {
      const { value } = field;
      const selected = f.options?.filter(option => option.value === value)[0];

      return !disabled && value !== ""
        ? selected
        : { value: "", label: i18n.t("fields.select_single") };
    };

    return (
      <Field
        key={f.id}
        name={f.id}
        render={({ field, form, ...other }) => {
          return (
            <>
              <SearchableSelect
                id={f.id}
                isDisabled={disabled}
                options={f.options}
                value={searchableValue(field)}
                onChange={data => f.onChange(data, field, form)}
                TextFieldProps={{
                  label: f.label,
                  margin: "dense",
                  placeholder: i18n.t("transfer.select_label"),
                  InputLabelProps: {
                    htmlFor: f.id,
                    shrink: true
                  }
                }}
                {...other}
                onBlur={field.onBlur}
              />

              {form && form.touched[field.name] && form.errors[field.name] && (
                <div className="MuiFormHelperText-root Mui-error">
                  {form.errors[field.name]}
                </div>
              )}
            </>
          );
        }}
      />
    );
  });

  return <>{internalFields}</>;
};

FormInternal.propTypes = {
  disabled: PropTypes.bool,
  fields: PropTypes.array
};

export default FormInternal;
