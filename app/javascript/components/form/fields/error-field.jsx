import React from "react";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { useFormContext } from "react-hook-form";
import Alert from "@material-ui/lab/Alert";

const ErrorField = ({ errorsToCheck }) => {
  const { errors } = useFormContext();

  return (
    <>
      {errorsToCheck?.size
        ? Object.keys(errors)
            .filter(error => errorsToCheck.includes(error))
            .map(error => (
              <Alert variant="outlined" severity="error" key={error}>
                {errors[error]?.message}
              </Alert>
            ))
        : null}
    </>
  );
};

ErrorField.displayName = "ErrorField";

ErrorField.defaultProps = {
  errorsToCheck: fromJS([])
};

ErrorField.propTypes = {
  errorsToCheck: PropTypes.object
};

export default ErrorField;
