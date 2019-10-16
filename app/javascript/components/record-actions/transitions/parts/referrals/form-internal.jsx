import React from "react";
import PropTypes from "prop-types";
import { Field } from "formik";
import { TextField } from "formik-material-ui";
import { useI18n } from "components/i18n";
import { SearchableSelect } from "components/searchable-select";

const FormInternal = ({ fields, disabled }) => {
  const i18n = useI18n();
  return (
    <>
      {fields.map(f => {
        return Object.keys(f).includes("options") ? (
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
                    value={
                      !disabled && field.value !== ""
                        ? { label: field.value, value: field.value }
                        : null
                    }
                    onChange={data => {
                      const { value } = data;
                      form.setFieldValue(field.name, value, false);
                    }}
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

                  {form &&
                    form.touched[field.name] &&
                    form.errors[field.name] && (
                      <div className="MuiFormHelperText-root Mui-error">
                        {form.errors[field.name]}
                      </div>
                    )}
                </>
              );
            }}
          />
        ) : (
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
      })}
    </>
  );
};

FormInternal.propTypes = {
  fields: PropTypes.array,
  disabled: PropTypes.bool
};

export default FormInternal;
