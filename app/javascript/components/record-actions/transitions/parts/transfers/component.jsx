import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useI18n } from "components/i18n";
import PropTypes from "prop-types";
import { Box, FormControlLabel } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { Checkbox as MuiCheckbox } from "formik-material-ui";
import * as yup from "yup";
import { enqueueSnackbar } from "components/notifier";
import { selectAgencies } from "components/application/selectors";
import { getOption } from "components/record-form/selectors";
import { RECORD_TYPES, USER_NAME_FIELD } from "config";
import BulkTransfer from "./bulk-transfer";
import { internalFieldsDirty, getInternalFields } from "../helpers";
import TransferInternal from "./transfer-internal";
import {
  getUsersByTransitionType,
  getErrorsByTransitionType
} from "../../selectors";
import ProvidedConsent from "./provided-consent";
import TransferActions from "./transfer-actions";
import { saveTransferUser, fetchTransferUsers } from "../../action-creators";

const TransferForm = ({
  providedConsent,
  isBulkTransfer,
  userPermissions,
  handleClose,
  transitionType,
  record,
  recordType
}) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);

  const firstUpdate = React.useRef(true);

  const closeModal = () => {
    handleClose();
  };

  useEffect(() => {
    dispatch(fetchTransferUsers({ record_type: RECORD_TYPES[recordType] }));
  }, []);

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
    const messages = hasErrors
      .valueSeq()
      .map(e => i18n.t(e))
      .join(", ");
    console.log(typeof messages, messages);
    if (messages !== "") {
      dispatch(enqueueSnackbar(messages, "error"));
    } else {
      closeModal();
    }
  }, [hasErrors]);

  const sharedOnChange = (data, field, form, queryValues) => {
    const { value } = data;

    form.setFieldValue(field.name, value, false);

    if (queryValues) {
      const result = getInternalFields(form.values, queryValues);
      const params = {
        record_type: RECORD_TYPES[recordType],
        [field.name]: value,
        ...result
      };

      if (value !== form.values[field.name]) {
        dispatch(fetchTransferUsers(params));
      }
    }
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
        : [],
      onChange: (data, field, form) => {
        sharedOnChange(data, field, form, ["location"]);
      }
    },
    {
      id: "location",
      label: i18n.t("transfer.location_label"),
      options: locations
        ? locations.map(location => ({
            value: location.id,
            label: location.display_text
          }))
        : [],
      onChange: (data, field, form) => {
        sharedOnChange(data, field, form, ["agency"]);
      }
    },
    {
      id: "transitioned_to",
      label: i18n.t("transfer.recipient_label"),
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
        sharedOnChange(data, field, form);
      }
    },
    {
      id: "notes",
      label: i18n.t("transfer.notes_label")
    }
  ];

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

  const formikForm = props => {
    const { handleSubmit, values, resetForm } = props;
    const { transfer } = values;

    if (
      !transfer &&
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
          <TransferInternal
            fields={internalFields}
            disableControl={disableControl}
          />
          <TransferActions closeModal={closeModal} />
        </Box>
      </Form>
    );
  };

  const validationSchema = yup.object().shape({
    transitioned_to: yup.string().required()
  });

  const formProps = {
    validationSchema,
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
          {
            data: {
              ...values,
              consent_overridden: canConsentOverride || values.transfer
            }
          },
          i18n.t("transfer.success")
        )
      );
      setSubmitting(false);
    },
    render: props => formikForm(props)
  };

  return <Formik {...formProps} />;
};

TransferForm.propTypes = {
  providedConsent: PropTypes.bool,
  isBulkTransfer: PropTypes.bool.isRequired,
  userPermissions: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  transitionType: PropTypes.string,
  record: PropTypes.object,
  values: PropTypes.object,
  handleSubmit: PropTypes.func,
  resetForm: PropTypes.func,
  recordType: PropTypes.string.isRequired
};

export default TransferForm;
