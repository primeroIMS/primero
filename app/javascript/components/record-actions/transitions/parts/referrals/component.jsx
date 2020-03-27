/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";
import { fromJS } from "immutable";

import { RECORD_TYPES } from "../../../../../config";
import { setServiceToRefer } from "../../../../record-form/action-creators";
import { getServiceToRefer } from "../../../../record-form";
import { useI18n } from "../../../../i18n";
import { saveReferral, fetchReferralUsers } from "../../action-creators";
import { getUserFilters } from "../helpers";

import MainForm from "./main-form";
import {
  REFERRAL_FIELD,
  REMOTE_SYSTEM_FIELD,
  SERVICE_FIELD,
  AGENCY_FIELD,
  LOCATION_FIELD,
  TRANSITIONED_TO_FIELD,
  NOTES_FIELD,
  NAME
} from "./constants";

const ReferralForm = ({
  userPermissions,
  providedConsent,
  recordType,
  record,
  referral,
  referralRef,
  setPending,
  disabled,
  setDisabled
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const serviceToRefer = useSelector(state => getServiceToRefer(state));

  useEffect(() => {
    return () => dispatch(setServiceToRefer(fromJS({})));
  }, []);

  const referralFromService = {
    [SERVICE_FIELD]: serviceToRefer.get("service_type"),
    [AGENCY_FIELD]: serviceToRefer.get("service_implementing_agency"),
    [LOCATION_FIELD]: serviceToRefer.get("service_delivery_location"),
    [TRANSITIONED_TO_FIELD]: serviceToRefer.get(
      "service_implementing_agency_individual"
    )
  };

  useEffect(() => {
    if (serviceToRefer.size) {
      const filters = getUserFilters(referralFromService);

      dispatch(
        fetchReferralUsers({
          record_type: RECORD_TYPES[recordType],
          ...filters
        })
      );
    }
  }, [serviceToRefer]);

  const canConsentOverride =
    userPermissions &&
    userPermissions.filter(permission => {
      return ["manage", "consent_override"].includes(permission);
    }).size > 0;

  const mainFormProps = {
    providedConsent,
    canConsentOverride,
    disabled,
    setDisabled,
    recordType,
    referral
  };

  const validationSchema = Yup.object().shape({
    [TRANSITIONED_TO_FIELD]: Yup.string().required(
      i18n.t("referral.user_mandatory_label")
    )
  });

  const formProps = {
    initialValues: {
      [REFERRAL_FIELD]: false,
      [REMOTE_SYSTEM_FIELD]: false,
      [SERVICE_FIELD]: "",
      [AGENCY_FIELD]: "",
      [LOCATION_FIELD]: "",
      [TRANSITIONED_TO_FIELD]: "",
      [NOTES_FIELD]: "",
      ...referralFromService
    },
    ref: referralRef,
    onSubmit: (values, { setSubmitting }) => {
      const recordId = record.get("id");

      setPending(true);

      dispatch(
        saveReferral(
          recordId,
          recordType,
          {
            data: {
              ...values,
              consent_overridden: canConsentOverride || values[REFERRAL_FIELD]
            }
          },
          i18n.t("referral.success", { record_type: recordType, id: recordId })
        )
      );
      setSubmitting(false);
    },
    render: props => <MainForm formProps={props} rest={mainFormProps} />,
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema
  };

  return <Formik {...formProps} />;
};

ReferralForm.displayName = NAME;

ReferralForm.propTypes = {
  disabled: PropTypes.bool,
  providedConsent: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  referral: PropTypes.object,
  referralRef: PropTypes.object,
  setDisabled: PropTypes.func,
  setPending: PropTypes.func,
  userPermissions: PropTypes.object
};

export default ReferralForm;
