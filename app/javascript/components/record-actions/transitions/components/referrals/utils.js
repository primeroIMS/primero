/* eslint-disable import/prefer-default-export */

import {
  USER_NAME_FIELD,
  ID_FIELD,
  DISPLAY_TEXT_FIELD,
  UNIQUE_ID_FIELD,
  NAME_FIELD,
  CODE_FIELD
} from "../../../../../config";
import { valuesToSearchableSelect } from "../../../../../libs";

import { SERVICE_FIELD, AGENCY_FIELD, LOCATION_FIELD, TRANSITIONED_TO_FIELD, NOTES_FIELD } from "./constants";

export const buildFields = ({
  i18n,
  serviceTypes,
  agencies,
  reportingLocations,
  users,
  loadReferralUsers,
  loading,
  clearDependentValues
}) => [
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
