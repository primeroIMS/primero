/* eslint-disable react/display-name */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Box, FormControlLabel } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { Checkbox as MuiCheckbox } from "formik-material-ui";
import { object, string } from "yup";

import { useI18n } from "../../../../i18n";
import { enqueueSnackbar } from "../../../../notifier";
import { selectAgencies } from "../../../../application/selectors";
import { getLocations } from "../../../../record-form/selectors";
import {
  RECORD_TYPES,
  USER_NAME_FIELD,
  UNIQUE_ID_FIELD,
  CODE_FIELD,
  NAME_FIELD
} from "../../../../../config";
import { internalFieldsDirty, getInternalFields } from "../helpers";
import {
  getUsersByTransitionType,
  getErrorsByTransitionType
} from "../../selectors";
import { saveTransferUser, fetchTransferUsers } from "../../action-creators";
import { valuesToSearchableSelect } from "../../../../../libs";
import { TRANSITIONS_TYPES } from "../../../../transitions/constants";

import TransferInternal from "./transfer-internal";
import ProvidedConsent from "./provided-consent";
import BulkTransfer from "./bulk-transfer";
import {
  TRANSFER_FIELD,
  REMOTE_SYSTEM_FIELD,
  CONSENT_INDIVIDUAL_FIELD,
  AGENCY_FIELD,
  LOCATION_FIELD,
  TRANSITIONED_TO_FIELD,
  NOTES_FIELD
} from "./constants";

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
      id: AGENCY_FIELD,
      label: i18n.t("transfer.agency_label"),
      options: valuesToSearchableSelect(
        agencies,
        UNIQUE_ID_FIELD,
        NAME_FIELD,
        i18n.locale
      ),
      onChange: (data, field, form) => {
        form.setFieldValue([TRANSITIONED_TO_FIELD], "", false);
        sharedOnChange(data, field, form, [LOCATION_FIELD]);
      }
    },
    {
      id: LOCATION_FIELD,
      label: i18n.t("transfer.location_label"),
      options: valuesToSearchableSelect(
        locations,
        CODE_FIELD,
        NAME_FIELD,
        i18n.locale
      ),
      onChange: (data, field, form) => {
        form.setFieldValue([TRANSITIONED_TO_FIELD], "", false);
        sharedOnChange(data, field, form, [AGENCY_FIELD]);
      }
    },
    {
      id: TRANSITIONED_TO_FIELD,
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
      id: NOTES_FIELD,
      label: i18n.t("transfer.notes_label")
    }
  ];

  const providedConsentProps = {
    canConsentOverride,
    providedConsent,
    setDisabled,
    recordType
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
      internalFieldsDirty(
        values,
        internalFields.map(f => f.id)
      )
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
        </Box>
      </Form>
    );
  };

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
    render: props => formikForm(props),
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
