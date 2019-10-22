import React, { useState } from "react";
import PropTypes from "prop-types";
import { useI18n } from "components/i18n";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import omit from "lodash/omit";
import isEqual from "lodash/isEqual";
import { Box, Button, FormControlLabel } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { Checkbox as MuiCheckbox } from "formik-material-ui";
import FormInternal from "./form-internal";
import ProvidedConsent from "./provided-consent";
import { getMockUsers } from "../../selectors";
import styles from "../../styles.css";

const ReferralForm = ({ handleClose, userPermissions, providedConsent }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const [disabled, setDisabled] = useState(false);
  const options = useSelector(state => getMockUsers(state));

  const fields = [
    {
      id: "service",
      label: i18n.t("referral.service_label"),
      options
    },
    {
      id: "agency",
      label: i18n.t("referral.agency_label"),
      options
    },
    {
      id: "location",
      label: i18n.t("referral.location_label"),
      options
    },
    {
      id: "recipient",
      label: i18n.t("referral.recipient_label"),
      options
    },
    {
      id: "notes",
      label: i18n.t("referral.notes_label")
    }
  ];

  const canConsentOverride =
    userPermissions &&
    userPermissions.filter(permission => {
      return ["manage", "consent_override"].includes(permission);
    }).size > 0;

  const referralForm = props => {
    const { handleSubmit, initialValues, values, resetForm } = props;
    const { referral } = values;
    const disableControl = !providedConsent && !disabled;
    if (
      !referral &&
      !providedConsent &&
      !isEqual(omit(initialValues, "referral"), omit(values, "referral"))
    ) {
      resetForm();
    }
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

        <Box
          display="flex"
          my={3}
          justifyContent="flex-start"
          className={css.modalAction}
        >
          <Button
            type="submit"
            color="primary"
            variant="contained"
            className={css.modalActionButton}
          >
            {i18n.t("buttons.referral")}
          </Button>
          <Button onClick={handleClose} color="primary" variant="outlined">
            {i18n.t("buttons.cancel")}
          </Button>
        </Box>
      </Form>
    );
  }

  const formProps = {
    initialValues: {
      referral: false,
      remoteSystem: false,
      service: "",
      agency: "",
      location: "",
      recipient: "",
      notes: ""
    },
    onSubmit: values => {
      console.log("SUBMIT", values);
    },
    render: props => referralForm(props)
  };

  const providedConsentProps = {
    canConsentOverride,
    providedConsent,
    setDisabled
  };

  return <Formik {...formProps} />;
};

ReferralForm.propTypes = {
  handleClose: PropTypes.func.isRequired,
  userPermissions: PropTypes.object,
  providedConsent: PropTypes.bool,
  handleSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  values: PropTypes.object,
  resetForm: PropTypes.func
};

export default ReferralForm;
