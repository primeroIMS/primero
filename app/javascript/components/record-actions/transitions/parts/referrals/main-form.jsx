import React, { useEffect } from "react";
import PropTypes from "prop-types";
import omit from "lodash/omit";
import isEqual from "lodash/isEqual";
import { Box, Button, FormControlLabel } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { Form, Field } from "formik";
import { Checkbox as MuiCheckbox } from "formik-material-ui";

import { selectAgencies } from "../../../../application/selectors";
import { getOption } from "../../../../record-form";
import { useI18n } from "../../../../i18n";
import { RECORD_TYPES, USER_NAME_FIELD } from "../../../../../config";
import { getInternalFields } from "../helpers";
import {
  getUsersByTransitionType,
  getErrorsByTransitionType
} from "../../selectors";
import { fetchReferralUsers } from "../../action-creators";
import styles from "../../styles.css";
import { enqueueSnackbar } from "../../../../notifier";

import ProvidedConsent from "./provided-consent";
import FormInternal from "./form-internal";
import Actions from "./actions";
import {
  SERVICE_FIELD,
  AGENCY_FIELD,
  LOCATION_FIELD,
  TRANSITIONED_TO_FIELD,
  NOTES_FIELD
} from "./constants";

const MainForm = ({ formProps, rest }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const css = makeStyles(styles)();
  const firstUpdate = React.useRef(true);
  const transitionType = "referral";
  const {
    providedConsent,
    canConsentOverride,
    disabled,
    setDisabled,
    handleClose,
    recordType
  } = rest;
  const { handleSubmit, initialValues, values, resetForm } = formProps;
  const { referral } = values;
  const disableControl = !providedConsent && !disabled;

  if (
    !referral &&
    !providedConsent &&
    !isEqual(omit(initialValues, transitionType), omit(values, transitionType))
  ) {
    resetForm();
  }

  const hasErrors = useSelector(state =>
    getErrorsByTransitionType(state, transitionType)
  );

  useEffect(() => {
    dispatch(fetchReferralUsers({ record_type: RECORD_TYPES[recordType] }));
  }, []);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    const messages = hasErrors
      .valueSeq()
      .map(e => i18n.t(e))
      .join(", ");
    if (messages !== "") {
      dispatch(enqueueSnackbar(messages, "error"));
    } else {
      handleClose();
    }
  }, [hasErrors]);

  const services = useSelector(state =>
    getOption(state, "lookup-service-type", i18n)
  );
  const agencies = useSelector(state => selectAgencies(state));
  const locations = useSelector(
    state => getOption(state, "reporting_location", i18n),
    []
  );
  const users = useSelector(state =>
    getUsersByTransitionType(state, transitionType)
  );

  const clearDependentValues = (dependants, form) =>
    dependants.forEach(value => {
      form.setFieldValue(value, "", false);
    });

  const getUsers = (name, currentValue, formValues, fields) => {
    const result = getInternalFields(formValues, fields);
    const params = {
      record_type: RECORD_TYPES[recordType],
      [name]: currentValue,
      ...result
    };
    if (currentValue !== formValues[name]) {
      dispatch(fetchReferralUsers(params));
    }
  };

  const fields = [
    {
      id: SERVICE_FIELD,
      label: i18n.t("referral.service_label"),
      options: services
        ? services.map(service => ({
            value: service.id.toLowerCase(),
            label: service.display_text
          }))
        : [],
      onChange: (data, field, form) => {
        const { value } = data;
        const queryValues = [LOCATION_FIELD];
        const dependentValues = [AGENCY_FIELD, TRANSITIONED_TO_FIELD];
        form.setFieldValue(field.name, value, false);
        clearDependentValues(dependentValues, form);
        getUsers(field.name, value, form.values, queryValues);
      }
    },
    {
      id: AGENCY_FIELD,
      label: i18n.t("referral.agency_label"),
      options: agencies
        ? agencies.toJS().map(agency => ({
            value: agency.unique_id,
            label: agency.name
          }))
        : [],
      onChange: (data, field, form) => {
        const { value } = data;
        const queryValues = [SERVICE_FIELD, LOCATION_FIELD];
        const dependentValues = [TRANSITIONED_TO_FIELD];
        form.setFieldValue(field.name, value, false);
        clearDependentValues(dependentValues, form);
        getUsers(field.name, value, form.values, queryValues);
      }
    },
    {
      id: LOCATION_FIELD,
      label: i18n.t("referral.location_label"),
      options: locations
        ? locations.map(location => ({
            value: location.id,
            label: location.display_text
          }))
        : [],
      onChange: (data, field, form) => {
        const { value } = data;
        const queryValues = [SERVICE_FIELD, AGENCY_FIELD];
        const dependentValues = [TRANSITIONED_TO_FIELD];
        form.setFieldValue(field.name, value, false);
        clearDependentValues(dependentValues, form);
        getUsers(field.name, value, form.values, queryValues);
      }
    },
    {
      id: TRANSITIONED_TO_FIELD,
      label: i18n.t("referral.recipient_label"),
      required: true,
      options: users
        ? users.valueSeq().map(user => {
            const userName = user.get(USER_NAME_FIELD);
            return {
              value: userName.toLowerCase(),
              label: userName
            };
          })
        : [],
      onChange: (data, field, form) => {
        const { value } = data;
        form.setFieldValue(field.name, value, false);
      }
    },
    {
      id: NOTES_FIELD,
      label: i18n.t("referral.notes_label")
    }
  ];

  const providedConsentProps = {
    canConsentOverride,
    providedConsent,
    setDisabled,
    recordType
  };

  const actionProps = {
    handleClose,
    disabled: disableControl
  };

  return (
    <Form onSubmit={handleSubmit}>
      <ProvidedConsent {...providedConsentProps} />
      <FormControlLabel
        control={
          <Field
            name="remoteSystem"
            component={MuiCheckbox}
            disabled={disableControl}
          />
        }
        label={i18n.t("referral.is_remote_label")}
      />
      <FormInternal fields={fields} disabled={disableControl} />
      <Actions {...actionProps} />
    </Form>
  );
};

MainForm.propTypes = {
  formProps: PropTypes.object,
  rest: PropTypes.object
};

export default MainForm;
