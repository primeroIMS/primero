import { useEffect } from "react";
import { useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { fromJS } from "immutable";
import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import { enqueueSnackbar } from "../../../notifier";
import { getValidationErrors } from "../../selectors";
import { setValidationErrors } from "../../action-creators";
import { useMemoizedSelector } from "../../../../libs";

import { removeEmptyArrays } from "./utils";
import { VALIDATION_ERRORS_NAME } from "./constants";

const ValidationErrors = ({ formErrors, forms }) => {
  const dispatch = useDispatch();
  const i18n = useI18n();

  const errors = useMemoizedSelector(state => getValidationErrors(state));

  const errorsWithoutEmptySubforms = removeEmptyArrays(formErrors);

  useEffect(() => {
    if (!isEmpty(errorsWithoutEmptySubforms)) {
      const fieldNames = Object.keys(errorsWithoutEmptySubforms);

      const formsWithErrors = forms.filter(value =>
        value
          .get("fields", fromJS([]))
          .filter(field => !field.get("disabled"))
          .map(field => field.get("name"))
          .some(fieldName => fieldNames.includes(fieldName))
      );

      const validationErrors = formsWithErrors.reduce(
        (prev, current) => [
          ...prev,
          {
            unique_id: current.get("unique_id"),
            form_group_id: current.get("form_group_id"),
            errors: current
              .get("fields")
              .filter(field => fieldNames.includes(field.get("name")))
              .map(field => ({
                [field.get("name")]: formErrors[field.get("name")]
              }))
              .reduce((acc, subCurrent) => ({ ...acc, ...subCurrent }), {})
          }
        ],
        []
      );

      dispatch(
        enqueueSnackbar(
          i18n.t("error_message.address_fields", {
            fields: Object.keys(errorsWithoutEmptySubforms).length,
            forms: formsWithErrors?.count() || 0
          }),
          { type: "error" }
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
};

export default ValidationErrors;
