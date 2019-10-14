import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useI18n } from "components/i18n";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { Box, Button, FormControlLabel, Checkbox } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { Checkbox as MuiCheckbox } from "formik-material-ui";
import { isEmpty } from "lodash";
import { selectAgencies } from "components/application/selectors";
import { getOption } from "components/record-form/selectors";
import BulkTransfer from "./bulk-transfer";
import TransferExternal from "./transfer-external";
import TransferInternal from "./transfer-internal";
import { getUsersByTransitionType } from "../selectors";
import styles from "../styles.css";

const TransferForm = ({
  providedConsent,
  isBulkTransfer,
  userPermissions,
  handleClose,
  transitionType
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const [disabled, setDisabled] = useState(false);

  const users = useSelector(state =>
    getUsersByTransitionType(state, transitionType)
  );

  const agencies = useSelector(state => selectAgencies(state));

  const locations = useSelector(
    state => getOption(state, "reporting_location", i18n),
    []
  );

  // TODO: Move this from outside or not
  const canConsentOverride =
    userPermissions &&
    userPermissions.filter(permission => {
      return ["manage", "consent_override"].includes(permission);
    }).size > 0;

  const closeModal = () => {
    handleClose();
  };

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
      id: "recipient",
      label: i18n.t("transfer.recipient_label"),
      options: users
        ? users.map(user => ({
            value: user.user_name.toLowerCase(),
            label: user.user_name
          }))
        : null
    },
    {
      id: "internalNotes",
      label: i18n.t("transfer.notes_label")
    }
  ];

  const externalFields = [
    {
      id: "typeOfTransition",
      label: "Type of transition",
      options: [{ value: "transfer", label: "Transfer" }]
    },
    {
      id: "otherUser",
      label: "Other User"
    },
    {
      id: "otherUserAgency",
      label: "Other User's Agency"
    },
    {
      id: "externalNotes",
      label: i18n.t("transfer.notes_label")
    },
    {
      id: "typeExport",
      label: "What type of export do you want?",
      options: [
        { value: "primero", label: "JSON (Primero)" },
        { value: "non_primero", label: "JSON (Non-Primero)" }
      ]
    },
    {
      id: "passwordFile",
      label: "Please enter a password that will encrypt your file."
    },
    {
      id: "fileName",
      label: "Create your own file name (Optional)"
    }
  ];

  // TODO: Move these methods to helper
  const dirtyFields = (fields, isExternal, removeFields) => {
    const fieldIds = isExternal
      ? externalFields.map(f => f.id)
      : internalFields.map(f => f.id);

    const data = Object.entries(fields).reduce((obj, item) => {
      const o = obj;
      const [key, value] = item;
      if (fieldIds.includes(key) && !isEmpty(value)) {
        o[key] = value;
      }
      return o;
    }, {});

    return removeFields ? data : Object.keys(data).length > 0;
  };

  const getInternalFields = fields => {
    return dirtyFields(fields, false, true);
  };

  const getExternalFields = fields => {
    return dirtyFields(fields, true, true);
  };

  const externalFieldsDirty = fields => {
    return dirtyFields(fields, true, false);
  };

  const internalFieldsDirty = fields => {
    return dirtyFields(fields, false, false);
  };

  const formProps = {
    initialValues: {
      transfer: false,
      remoteSystem: false,
      consentFromIndividual: false,
      agency: "",
      location: "",
      recipient: "",
      internalNotes: "",
      typeOfTransition: "",
      otherUser: "",
      otherUserAgency: "",
      externalNotes: "",
      typeExport: "",
      passwordFile: "",
      fileName: ""
    },
    // TODO: Consider moving outside
    onSubmit: (values, { setSubmitting }) => {
      let data;
      const { transfer, remoteSystem, consentFromIndividual } = values;
      if (remoteSystem && externalFieldsDirty(values)) {
        data = getExternalFields(values);
      } else if (transfer && internalFieldsDirty(values)) {
        data = getInternalFields(values);
      }
      console.log("DISPATCH SUBMIT", {
        ...data,
        transfer,
        remoteSystem,
        consentFromIndividual
      });
      setSubmitting(false);
    }
  };

  return (
    <Formik {...formProps}>
      {({ handleSubmit, values, resetForm, setFieldValue }) => {
        const disableControl = !providedConsent && !disabled;
        console.log("VALUES", values);
        if (
          values.transfer &&
          externalFieldsDirty(values) &&
          !values.remoteSystem
        ) {
          console.log("CLEAR EXTERNAL FIELDS", getExternalFields(values));
          Object.keys(getExternalFields(values)).map(f => setFieldValue(f));
        }
        if (values.remoteSystem && internalFieldsDirty(values)) {
          console.log("CLEAR INTERNAL FIELDS", getInternalFields(values));
          Object.keys(getInternalFields(values)).map(f => setFieldValue(f));
        }
        if (!values.transfer && values.remoteSystem) {
          console.log("CLEAR ALL FORM");
          resetForm();
        }

        return (
          <Form onSubmit={handleSubmit}>
            {!providedConsent ? (
              <div className={css.alertTransferModal}>
                {i18n.t("transfer.provided_consent_label")}
              </div>
            ) : null}
            {isBulkTransfer ? <BulkTransfer /> : null}
            <Box>
              {canConsentOverride && !providedConsent ? (
                <FormControlLabel
                  control={
                    <Field
                      name="transfer"
                      render={({ field, form }) => (
                        <Checkbox
                          checked={field.value}
                          onChange={() => {
                            setDisabled(!field.value);
                            form.setFieldValue(field.name, !field.value, false);
                          }}
                        />
                      )}
                    />
                  }
                  label={i18n.t("transfer.transfer_label")}
                />
              ) : null}
              <br />
              <FormControlLabel
                control={
                  <Field
                    name="remoteSystem"
                    component={MuiCheckbox}
                    disabled={disableControl}
                  />
                }
                label={i18n.t("transfer.is_remote_label")}
              />
              <FormControlLabel
                control={
                  <Field
                    name="consentFromIndividual"
                    component={MuiCheckbox}
                    disabled={disableControl}
                  />
                }
                label={i18n.t("transfer.consent_from_individual_label")}
              />
              {values.remoteSystem ? (
                <TransferExternal fields={externalFields} />
              ) : (
                <TransferInternal
                  fields={internalFields}
                  disableControl={disableControl}
                />
              )}

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
                  {i18n.t("transfer.submit_label")}
                </Button>
                <Button onClick={closeModal} color="primary" variant="outlined">
                  {i18n.t("buttons.cancel")}
                </Button>
              </Box>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

TransferForm.propTypes = {
  providedConsent: PropTypes.bool.isRequired,
  isBulkTransfer: PropTypes.bool.isRequired,
  userPermissions: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  transitionType: PropTypes.string
};

export default TransferForm;
