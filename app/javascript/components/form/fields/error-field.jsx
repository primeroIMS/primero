import PropTypes from "prop-types";
import { fromJS } from "immutable";
import Alert from "@material-ui/lab/Alert";

import { ERROR_FIELD_NAME } from "./constants";

const ErrorField = ({ errorsToCheck, formMethods }) => {
  const { errors } = formMethods;

  if (!errorsToCheck?.size) {
    return false;
  }

  const errorsToRender =
    errorsToCheck?.size && errors ? Object.keys(errors).filter(error => errorsToCheck.includes(error)) : [];

  return errorsToRender.map(error => (
    <Alert variant="outlined" severity="error" key={error}>
      {errors[error].message}
    </Alert>
  ));
};

ErrorField.displayName = ERROR_FIELD_NAME;

ErrorField.defaultProps = {
  errorsToCheck: fromJS([])
};

ErrorField.propTypes = {
  errorsToCheck: PropTypes.object
};

export default ErrorField;
