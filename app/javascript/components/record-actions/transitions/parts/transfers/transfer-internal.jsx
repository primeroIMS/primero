import React from "react";
import PropTypes from "prop-types";
import { TextField } from "formik-material-ui";
import { Field } from "formik";

import { useI18n } from "../../../../i18n";

import { TRANSFER_INTERNAL_NAME as NAME } from "./constants";
import searchableField from "./searchable-field";

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
          autoComplete="off"
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

    return (
      <Field
        key={f.id}
        name={f.id}
        render={props => searchableField(f, props, disableControl, i18n)}
      />
    );
  });

  return <>{transferInternalForm}</>;
};

TransferInternal.displayName = NAME;

TransferInternal.propTypes = {
  disableControl: PropTypes.bool.isRequired,
  fields: PropTypes.array.isRequired
};

export default TransferInternal;
