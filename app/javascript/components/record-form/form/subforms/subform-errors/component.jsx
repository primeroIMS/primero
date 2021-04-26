import { useEffect } from "react";
import { fromJS } from "immutable";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";

import { useI18n } from "../../../../i18n";
import InternalAlert from "../../../../internal-alert";

const Component = ({ initialErrors, errors, setErrors, setTouched }) => {
  const i18n = useI18n();

  const errorMessages = Object.entries(isEmpty(errors) ? initialErrors || {} : errors).map(([, value]) => ({
    message: value
  }));

  useEffect(() => {
    if (!isEmpty(initialErrors)) {
      setErrors(initialErrors);
      setTouched(
        Object.entries(initialErrors)
          .map(([key]) => ({ [key]: true }))
          .reduce((acc, current) => ({ ...acc, ...current }), {})
      );
    }
  }, [initialErrors]);

  return errorMessages?.length ? (
    <InternalAlert
      title={i18n.t("error_message.address_form_fields", {
        fields: errorMessages.length
      })}
      items={fromJS(errorMessages)}
      severity="error"
    />
  ) : null;
};

Component.displayName = "SubformErrors";

Component.propTypes = {
  errors: PropTypes.object,
  initialErrors: PropTypes.object,
  setErrors: PropTypes.func.isRequired,
  setTouched: PropTypes.func.isRequired
};

export default Component;
