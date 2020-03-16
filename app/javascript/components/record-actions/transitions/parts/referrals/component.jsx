import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Formik } from "formik";

import { useI18n } from "../../../../i18n";
import { saveReferral } from "../../action-creators";

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
  handleClose,
  userPermissions,
  providedConsent,
  recordType,
  record,
  referral
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);

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
    handleClose,
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
      ...referral
    },
    onSubmit: (values, { setSubmitting }) => {
      const recordId = record.get("id");

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
  handleClose: PropTypes.func.isRequired,
  providedConsent: PropTypes.bool,
  record: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  referral: PropTypes.object,
  userPermissions: PropTypes.object
};

export default ReferralForm;
