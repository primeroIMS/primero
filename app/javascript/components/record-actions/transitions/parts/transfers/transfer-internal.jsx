import React from "react";
import PropTypes from "prop-types";
import { TextField } from "formik-material-ui";
import { Field } from "formik";
import { useI18n } from "components/i18n";
import { SearchableSelect } from "components/searchable-select";

const TransferInternal = ({ disableControl, fields }) => {
  const i18n = useI18n();
  const transferInternalForm = fields.map(f => {
    if (!Object.keys(f).includes("options")) {
      return (
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
    }

    const searchTextFieldProps = field => {
      const { id, label } = field;
      return {
        label,
        margin: "dense",
        placeholder: i18n.t("transfer.select_label"),
        InputLabelProps: {
          htmlFor: id,
          shrink: true
        }
      };
    };

    const searchableValue = field => {
      const { value } = field;
      const selected = f.options.filter(option => option.value === value)[0];
      return !disableControl && value !== ""
        ? selected
        : { value: "", label: "" };
    };

    const searchableField = (searchField, props) => {
      const { id, options } = searchField;
      const { field, form, ...other } = props;
      const SearchableErrors = (formErrors, fieldError) => {
        const { name } = fieldError;
        const { touched, errors } = formErrors;
        if (!errors) {
          return null;
        }
        return (
          form &&
          touched[name] &&
          errors[name] && (
            <div className="MuiFormHelperText-root Mui-error">
              {errors[name]}
            </div>
          )
        );
      };
      return (
        <>
          <SearchableSelect
            id={id}
            isDisabled={disableControl}
            options={options}
            value={searchableValue(field)}
            onChange={data => f.onChange(data, field, form)}
            TextFieldProps={searchTextFieldProps(searchField)}
            {...other}
            onBlur={field.onBlur}
          />
          <SearchableErrors formErrors={form} fieldError={field} />
        </>
      );
    };

    return (
      <Field
        key={f.id}
        name={f.id}
        render={props => searchableField(f, props)}
      />
    );
  });
  return <>{transferInternalForm}</>;
};

TransferInternal.propTypes = {
  disableControl: PropTypes.bool.isRequired,
  fields: PropTypes.array.isRequired
};

export default TransferInternal;
