import React from "react";
import PropTypes from "prop-types";
import { TextField } from "formik-material-ui";
import { Field } from "formik";
import { useI18n } from "components/i18n";
import { SearchableSelect } from "components/searchable-select";

const TransferInternal = ({ disableControl, fields }) => {
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
                    isDisabled={disableControl}
                    options={f.options}
                    onChange={data => {
                      const { value } = data;
                      form.setFieldValue(field.name, value, false);
                    }}
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
                  />

                  {form.touched[field.name] && form.errors[field.name] && (
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
            disabled={disableControl}
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

TransferInternal.propTypes = {
  disableControl: PropTypes.bool.isRequired,
  fields: PropTypes.array.isRequired
};

export default TransferInternal;
