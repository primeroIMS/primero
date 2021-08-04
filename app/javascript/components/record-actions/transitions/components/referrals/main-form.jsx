import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FormControlLabel } from "@material-ui/core";
import { batch, useDispatch } from "react-redux";
import { Form, Field } from "formik";
import { Checkbox as MuiCheckbox } from "formik-material-ui";

import { getEnabledAgencies, getReportingLocationConfig } from "../../../../application/selectors";
import { useI18n } from "../../../../i18n";
import {
  RECORD_TYPES,
  USER_NAME_FIELD,
  ID_FIELD,
  DISPLAY_TEXT_FIELD,
  UNIQUE_ID_FIELD,
  NAME_FIELD,
  CODE_FIELD,
  LOOKUPS
} from "../../../../../config";
import { getUsersByTransitionType, getErrorsByTransitionType } from "../../selectors";
import { fetchReferralUsers } from "../../action-creators";
import { enqueueSnackbar } from "../../../../notifier";
import { getOption, getReportingLocations, getServiceToRefer } from "../../../../record-form";
import { useMemoizedSelector, valuesToSearchableSelect } from "../../../../../libs";
import { getLoading } from "../../../../index-table";
import { getUserFilters } from "../utils";

import ProvidedConsent from "./provided-consent";
import FormInternal from "./form-internal";
import {
  SERVICE_FIELD,
  AGENCY_FIELD,
  LOCATION_FIELD,
  TRANSITIONED_TO_FIELD,
  NOTES_FIELD,
  MAIN_FORM,
  SERVICE_RECORD_FIELD
} from "./constants";

const MainForm = ({ formProps, rest }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const firstUpdate = useRef(true);
  const transitionType = "referral";
  const {
    providedConsent,
    canConsentOverride,
    disabled,
    setDisabled,
    recordType,
    recordModuleID,
    isReferralFromService
  } = rest;

  const { handleSubmit, setValues, values } = formProps;
  const { service, agency, location } = values;
  const disableControl = !providedConsent && !disabled;

  const NAMESPACE = ["transitions", "referral"];

  const serviceToRefer = useMemoizedSelector(state => getServiceToRefer(state));
  const serviceTypes = useMemoizedSelector(state => getOption(state, LOOKUPS.service_type, i18n.locale));
  const adminLevel = useMemoizedSelector(state => getReportingLocationConfig(state).get("admin_level"));
  const reportingLocations = useMemoizedSelector(state => getReportingLocations(state, adminLevel));
  const loading = useMemoizedSelector(state => getLoading(state, NAMESPACE));
  const agencies = useMemoizedSelector(state => getEnabledAgencies(state, service));
  const users = useMemoizedSelector(state => getUsersByTransitionType(state, transitionType));

  const loadReferralUsers = () => {
    const filters = getUserFilters({ service, agency, location });

    dispatch(
      fetchReferralUsers({
        record_module_id: recordModuleID,
        record_type: RECORD_TYPES[recordType],
        ...filters
      })
    );
  };

  useEffect(() => {
    batch(() => {
      dispatch(
        fetchReferralUsers({
          record_type: RECORD_TYPES[recordType],
          record_module_id: recordModuleID,
          ...getUserFilters({ service, agency, location })
        })
      );
    });
  }, []);

  useEffect(() => {
    const selectedUserName = serviceToRefer.get("service_implementing_agency_individual", "");
    const selectedUser = users.find(user => user.get("user_name") === selectedUserName);

    if (selectedUser?.size) {
      setValues({ ...values, [TRANSITIONED_TO_FIELD]: selectedUserName });
    } else {
      setValues({ ...values, [TRANSITIONED_TO_FIELD]: "" });
    }
  }, [users]);

  const hasErrors = useMemoizedSelector(state => getErrorsByTransitionType(state, transitionType));

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
      dispatch(enqueueSnackbar(messages, { type: "error" }));
    }
  }, [hasErrors]);

  const clearDependentValues = (dependants, form) =>
    dependants.forEach(value => {
      form.setFieldValue(value, "", false);
    });

  const fields = [
    {
      id: SERVICE_FIELD,
      label: i18n.t("referral.service_label"),
      options: valuesToSearchableSelect(serviceTypes, ID_FIELD, DISPLAY_TEXT_FIELD, i18n.locale),
      onChange: (data, field, form) => {
        const { value } = data;
        const dependentValues = [AGENCY_FIELD, TRANSITIONED_TO_FIELD];

        form.setFieldValue(field.name, value, false);
        clearDependentValues(dependentValues, form);
      }
    },
    {
      id: AGENCY_FIELD,
      label: i18n.t("referral.agency_label"),
      options: valuesToSearchableSelect(agencies, UNIQUE_ID_FIELD, NAME_FIELD, i18n.locale),
      onChange: (data, field, form) => {
        const { value } = data;
        const dependentValues = [TRANSITIONED_TO_FIELD];

        form.setFieldValue(field.name, value, false);
        clearDependentValues(dependentValues, form);
      }
    },
    {
      id: LOCATION_FIELD,
      label: i18n.t("referral.location_label"),
      options: valuesToSearchableSelect(reportingLocations, CODE_FIELD, NAME_FIELD, i18n.locale),
      onChange: (data, field, form) => {
        const { value } = data;
        const dependentValues = [TRANSITIONED_TO_FIELD];

        form.setFieldValue(field.name, value, false);
        clearDependentValues(dependentValues, form);
      }
    },
    {
      id: TRANSITIONED_TO_FIELD,
      label: i18n.t("referral.recipient_label"),
      required: true,
      options: users
        ? users.valueSeq().reduce((prev, current) => {
            const userName = current.get(USER_NAME_FIELD);

            return [
              ...prev,
              {
                value: userName.toLowerCase(),
                label: userName
              }
            ];
          }, [])
        : [],
      onChange: (data, field, form) => {
        const { value } = data;

        const selectedUser = users.find(user => user.get("user_name") === value);

        form.setFieldValue(field.name, value, false);

        if (selectedUser?.size) {
          if (agencies.find(current => current.get("unique_id") === selectedUser.get("agency"))) {
            form.setFieldValue("agency", selectedUser.get("agency"));
          }

          if (reportingLocations.find(current => current.get("code") === selectedUser.get("location"))) {
            form.setFieldValue("location", selectedUser.get("location"));
          }
        }
      },
      onMenuOpen: loadReferralUsers,
      isLoading: loading
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

  return (
    <Form onSubmit={handleSubmit}>
      <ProvidedConsent {...providedConsentProps} />
      {serviceToRefer.size ? null : (
        <FormControlLabel
          control={<Field name="remoteSystem" component={MuiCheckbox} disabled={disableControl} />}
          label={i18n.t("referral.is_remote_label")}
        />
      )}
      <Field name={SERVICE_RECORD_FIELD} type="hidden" />
      <FormInternal
        fields={fields}
        disabled={Boolean(serviceToRefer.size) || disableControl}
        isReferralFromService={isReferralFromService}
      />
    </Form>
  );
};

MainForm.displayName = MAIN_FORM;

MainForm.propTypes = {
  formProps: PropTypes.object,
  rest: PropTypes.object
};

export default MainForm;
