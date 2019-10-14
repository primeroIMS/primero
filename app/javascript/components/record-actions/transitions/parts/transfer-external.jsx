import React from "react";
import PropTypes from "prop-types";
import { InputLabel, FormControl, MenuItem } from "@material-ui/core";
import { Select, TextField } from "formik-material-ui";
import { Field } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../styles.css";

const TransferExternal = ({ fields }) => {
  const css = makeStyles(styles)();
  return (
    <>
      {fields.map(field => {
        const hasOptions = Object.keys(field).includes("options");
        return (
          <FormControl
            key={field.id}
            fullWidth
            className={css.transferExternal}
          >
            <InputLabel shrink htmlFor={field.id}>
              {field.label}
            </InputLabel>
            <Field
              component={hasOptions ? Select : TextField}
              name={field.id}
              fullWidth
              margin={hasOptions ? "dense" : "normal"}
              value={hasOptions ? field.id : null}
            >
              {hasOptions
                ? field.options.map(o => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))
                : null}
            </Field>
          </FormControl>
        );
      })}
    </>
  );
};

TransferExternal.propTypes = {
  fields: PropTypes.array.isRequired
};

export default TransferExternal;
