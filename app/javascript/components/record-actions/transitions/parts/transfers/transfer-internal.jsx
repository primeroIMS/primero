import React from "react";
import PropTypes from "prop-types";
import { TextField } from "formik-material-ui";
import { Field } from "formik";

import { useI18n } from "../../../../i18n";
import { SearchableSelect } from "../../../../searchable-select";

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

    const searchTextFieldProps = (field, form) => {
      const { id, label, required } = field;
      const { errors } = form;

      return {
        label,
        required,
        error: errors?.[id],
        helperText: errors?.[id],
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
        : { value: "", label: i18n.t("fields.select_single") };
    };

    const searchableField = (searchField, props) => {
      const { id, options } = searchField;
      const { field, form, ...other } = props;

      return (
        <>
          <SearchableSelect
            id={id}
            isDisabled={disableControl}
            options={options}
            value={searchableValue(field)}
            onChange={data => f.onChange(data, field, form)}
            TextFieldProps={searchTextFieldProps(searchField, form)}
            {...other}
            onBlur={field.onBlur}
          />
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
