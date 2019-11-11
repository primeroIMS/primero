import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { FastField, connect, getIn } from "formik";
import { Switch } from "formik-material-ui";
import pickBy from "lodash/pickBy";
import { FormControlLabel } from "@material-ui/core";

const TickField = ({ name, label, formik, ...rest }) => {
  const fieldProps = {
    name,
    ...pickBy(rest, (v, k) => ["disabled"].includes(k))
  };

  useEffect(() => {
    if (rest.checked && !getIn(formik.values, name) && rest.mode.isNew) {
      formik.setFieldValue(name, true, false);
    }
  }, [formik, name, rest.checked, rest.mode.isNew]);

  return (
    <FormControlLabel
      label={label}
      control={
        <FastField
          name={name}
          render={renderProps => {
            return (
              <Switch
                {...fieldProps}
                form={renderProps.form}
                field={{
                  ...renderProps.field
                }}
              />
            );
          }}
        />
      }
    />
  );
};

TickField.propTypes = {
  formik: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string
};

export default connect(TickField);
