import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "components/i18n";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { Box, FormControlLabel } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { Checkbox as MuiCheckbox } from "formik-material-ui";
import { enqueueSnackbar } from "components/notifier";
import { selectAgencies } from "components/application/selectors";
import { getOption } from "components/record-form/selectors";
import BulkTransfer from "./bulk-transfer";
import { internalFieldsDirty } from "../helpers";
import TransferInternal from "./transfer-internal";
import {
  getUsersByTransitionType,
  getErrorsByTransitionType
} from "../../selectors";
import ProvidedConsent from "./provided-consent";
import TransferActions from "./transfer-actions";
import { saveTransferUser } from "../../action-creators";

const TransferForm = ({
  providedConsent,
  isBulkTransfer,
  userPermissions,
  handleClose,
  transitionType,
  record
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);

  const firstUpdate = React.useRef(true);

  const closeModal = () => {
    handleClose();
  };

  const users = useSelector(state =>
    getUsersByTransitionType(state, transitionType)
  );

  const hasErrors = useSelector(state =>
    getErrorsByTransitionType(state, transitionType)
  );

  const agencies = useSelector(state => selectAgencies(state));

  const locations = useSelector(
    state => getOption(state, "reporting_location", i18n),
    []
  );

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
    const isUndefined = typeof hasErrors === "undefined";
    if (!isEmpty(hasErrors)) {
      const messages = Array.isArray(hasErrors)
        ? hasErrors.map(e => i18n.t(e)).join(", ")
        : hasErrors;
      dispatch(enqueueSnackbar(messages, "error"));
    } else if (!isUndefined && isEmpty(hasErrors)) {
      closeModal();
    }
  }, [hasErrors]);

  const internalFields = [
    {
      id: "agency",
      label: i18n.t("transfer.agency_label"),
      options: agencies
        ? agencies.toJS().map(agency => ({
            value: agency.unique_id,
            label: agency.name
          }))
        : null
    },
    {
      id: "location",
      label: i18n.t("transfer.location_label"),
      options: locations
        ? locations.map(location => ({
            value: location.id,
            label: location.display_text
          }))
        : null
    },
    {
      id: "transitioned_to",
      label: i18n.t("transfer.recipient_label"),
      options: users
        ? users.map(user => ({
            value: user.user_name.toLowerCase(),
            label: user.user_name
          }))
        : null
    },
    {
      id: "notes",
      label: i18n.t("transfer.notes_label")
    }
  ];

  const formProps = {
    initialValues: {
      transfer: false,
      remoteSystem: false,
      consent_individual_transfer: false,
      agency: "",
      location: "",
      transitioned_to: "",
      notes: ""
    },
    onSubmit: (values, { setSubmitting }) => {
      dispatch(
        saveTransferUser(
          record.get("id"),
          { data: { ...values, consent_overridden: canConsentOverride } },
          i18n.t("transfer.success")
        )
      );
      setSubmitting(false);
    }
  };

  const providedConsentProps = {
    canConsentOverride,
    providedConsent,
    setDisabled
  };

  const disableControl = !providedConsent && !disabled;

  const sharedFields = [
    {
      id: "remoteSystem",
      label: i18n.t("transfer.is_remote_label")
    },
    {
      id: "consent_individual_transfer",
      label: i18n.t("transfer.consent_from_individual_label")
    }
  ];

  const sharedControls = sharedFields.map(field => (
    <FormControlLabel
      key={field.id}
      control={
        <Field
          name={field.id}
          component={MuiCheckbox}
          disabled={disableControl}
        />
      }
      label={field.label}
    />
  ));

  return (
    <Formik {...formProps}>
      {({ handleSubmit, values, resetForm }) => {
        if (
          !values.transfer &&
          !providedConsent &&
          internalFieldsDirty(values, internalFields.map(f => f.id))
        ) {
          resetForm();
        }
        return (
          <Form onSubmit={handleSubmit}>
            <ProvidedConsent {...providedConsentProps} />
            <BulkTransfer isBulkTransfer={isBulkTransfer} />
            <Box>
              {sharedControls}
              <FormControlLabel
                control={
                  <Field
                    name="consent_individual_transfer"
                    component={MuiCheckbox}
                    disabled={disableControl}
                  />
                }
                label={i18n.t("transfer.consent_from_individual_label")}
              />
              <TransferInternal
                fields={internalFields}
                disableControl={disableControl}
              />
              <TransferActions close={closeModal} />
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

TransferForm.propTypes = {
  providedConsent: PropTypes.bool,
  isBulkTransfer: PropTypes.bool.isRequired,
  userPermissions: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  transitionType: PropTypes.string,
  record: PropTypes.object
};

export default TransferForm;
