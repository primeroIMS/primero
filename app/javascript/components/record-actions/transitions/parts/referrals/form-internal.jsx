import React from "react";
import PropTypes from "prop-types";
import { Field } from "formik";
import { TextField } from "formik-material-ui";
import { useI18n } from "components/i18n";
import { SearchableSelect } from "components/searchable-select";

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
      return !disabled && value !== "" ? { label: value, value } : null;
    };
    const searchableChange = (data, field, form) => {
      const { value } = data;
      form.setFieldValue(field.name, value, false);
    }
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
                onChange={data => searchableChange(data, field, form)}
                TextFieldProps={{
                  label: f.label,
                  margin: "dense",
                  placeholder: i18n.t("transfer.select_label"),
                  value: "Hola",
                  InputLabelProps: {
                    htmlFor: f.id,
                    shrink: true
                  }
                }}
                {...other}
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
  fields: PropTypes.array,
  disabled: PropTypes.bool
};

export default FormInternal;
