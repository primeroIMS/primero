import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { fromJS } from "immutable";
import PropTypes from "prop-types";

import { compare } from "../../../../libs";
import { useI18n } from "../../../i18n";
import { enqueueSnackbar } from "../../../notifier";
import { getValidationErrors } from "../../selectors";
import { setValidationErrors } from "../../action-creators";

import { VALIDATION_ERRORS_NAME } from "./constants";

const ValidationErrors = ({ formErrors, forms }) => {
  const dispatch = useDispatch();
  const errors = useSelector(state => getValidationErrors(state), compare);
  const i18n = useI18n();

  useEffect(() => {
    if (!isEmpty(formErrors)) {
      const fieldNames = Object.keys(formErrors);

      const formsWithErrors = forms.filter(value =>
        value
          .get("fields", fromJS([]))
          .map(field => field.get("name"))
          .some(fieldName => fieldNames.includes(fieldName))
      );

      const validationErrors = formsWithErrors
        .map(form => ({
          unique_id: form.get("unique_id"),
          form_group_id: form.get("form_group_id"),
          errors: form
            .get("fields")
            .filter(field => fieldNames.includes(field.get("name")))
            .map(field => ({
              [field.get("name")]: formErrors[field.get("name")]
            }))
            .reduce((acc, current) => ({ ...acc, ...current }), {})
        }))
        .toJS();

      dispatch(
        enqueueSnackbar(
          i18n.t("error_message.address_fields", {
            fields: Object.keys(formErrors).length,
            forms: formsWithErrors?.count() || 0
          }),
          "error"
        )
      );

      if (!fromJS(validationErrors).equals(errors)) {
        dispatch(setValidationErrors(validationErrors));
      }
    }
  }, [formErrors]);

  return null;
};

ValidationErrors.displayName = VALIDATION_ERRORS_NAME;

ValidationErrors.propTypes = {
  formErrors: PropTypes.object,
  forms: PropTypes.object
}

export default ValidationErrors;
