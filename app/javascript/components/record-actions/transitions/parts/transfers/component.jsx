/* eslint-disable react/display-name */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Formik } from "formik";
import { object, string } from "yup";

import { useI18n } from "../../../../i18n";
import { enqueueSnackbar } from "../../../../notifier";
import { selectAgencies } from "../../../../application/selectors";
import { getLocations } from "../../../../record-form/selectors";
import { RECORD_TYPES } from "../../../../../config";
import {
  getUsersByTransitionType,
  getErrorsByTransitionType
} from "../../selectors";
import { saveTransferUser, fetchTransferUsers } from "../../action-creators";
import { TRANSITIONS_TYPES } from "../../../../transitions/constants";

import {
  TRANSFER_FIELD,
  REMOTE_SYSTEM_FIELD,
  CONSENT_INDIVIDUAL_FIELD,
  AGENCY_FIELD,
  LOCATION_FIELD,
  TRANSITIONED_TO_FIELD,
  NOTES_FIELD
} from "./constants";
import formikForm from "./formik-form";

const TransferForm = ({
  providedConsent,
  isBulkTransfer,
  userPermissions,
  record,
  recordType,
  transferRef,
  setPending,
  disabled,
  setDisabled
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();

  const firstUpdate = React.useRef(true);

  useEffect(() => {
    dispatch(fetchTransferUsers({ record_type: RECORD_TYPES[recordType] }));
  }, []);

  const users = useSelector(state =>
    getUsersByTransitionType(state, TRANSITIONS_TYPES.transfer)
  );

  const hasErrors = useSelector(state =>
    getErrorsByTransitionType(state, TRANSITIONS_TYPES.transfer)
  );

  const agencies = useSelector(state => selectAgencies(state));

  const locations = useSelector(state => getLocations(state));

  const canConsentOverride =
    userPermissions &&
    userPermissions.filter(permission => {
      return ["manage", "consent_override"].includes(permission);
    }).size > 0;

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
    }
  }, [hasErrors]);

  const disableControl = !providedConsent && !disabled;

  const validationSchema = object().shape({
    [TRANSITIONED_TO_FIELD]: string().required(
      i18n.t("transfer.user_mandatory")
    )
  });

  const formProps = {
    initialValues: {
      [TRANSFER_FIELD]: false,
      [REMOTE_SYSTEM_FIELD]: false,
      [CONSENT_INDIVIDUAL_FIELD]: false,
      [AGENCY_FIELD]: "",
      [LOCATION_FIELD]: "",
      [TRANSITIONED_TO_FIELD]: "",
      [NOTES_FIELD]: ""
    },
    ref: transferRef,
    onSubmit: (values, { setSubmitting }) => {
      setPending(true);
      dispatch(
        saveTransferUser(
          record.get("id"),
          {
            data: {
              ...values,
              consent_overridden: canConsentOverride || values[TRANSFER_FIELD]
            }
          },
          i18n.t("transfer.success")
        )
      );
      setSubmitting(false);
    },
    render: props =>
      formikForm(
        props,
        isBulkTransfer,
        users,
        agencies,
        locations,
        recordType,
        setDisabled,
        disableControl,
        i18n,
        dispatch,
        providedConsent,
        canConsentOverride
      ),
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema
  };

  return <Formik {...formProps} />;
};

TransferForm.propTypes = {
  disabled: PropTypes.bool,
  handleSubmit: PropTypes.func,
  isBulkTransfer: PropTypes.bool.isRequired,
  providedConsent: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  resetForm: PropTypes.func,
  setDisabled: PropTypes.func,
  setPending: PropTypes.func,
  transferRef: PropTypes.object,
  userPermissions: PropTypes.object.isRequired,
  values: PropTypes.object
};

export default TransferForm;
