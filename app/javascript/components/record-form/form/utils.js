import find from "lodash/find";
import { fromJS } from "immutable";
import { getIn } from "formik";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import isEqual from "lodash/isEqual";

import { FormSectionRecord } from "../records";
import { SERVICE_SECTION_FIELDS } from "../../record-actions/transitions/components/referrals";
import {
  CODE_FIELD,
  NAME_FIELD,
  UNIQUE_ID_FIELD,
  APPROVALS,
  CHANGE_LOGS,
  INCIDENT_FROM_CASE,
  RECORD_INFORMATION_GROUP,
  RECORD_OWNER,
  REFERRAL,
  TRANSFERS_ASSIGNMENTS
} from "../../../config";
import { SUBFORM_SECTION } from "../constants";

import { valuesWithDisplayConditions } from "./subforms/subform-field-array/utils";
import { CUSTOM_STRINGS_SOURCE } from "./constants";

const sortSubformsValues = (values, fields) => {
  const result = Object.entries(values).reduce((acc, curr) => {
    const [key, value] = curr;
    const subformField = fields.find(field => field.name === key && field.type === SUBFORM_SECTION);
    // eslint-disable-next-line camelcase
    const sortField = subformField?.subform_section_configuration?.subform_sort_by;

    if (!subformField || !sortField) {
      return { ...acc, [key]: value };
    }

    const orderedValues = orderBy(value, [sortField], ["asc"]);

    return { ...acc, [key]: orderedValues };
  }, {});

  return result;
};

export const withStickyOption = (options, stickyOptionId, filtersChanged = false) => {
  const enabledOptions = options
    .filter(option => !option.get("disabled") || (stickyOptionId && option.get("unique_id") === stickyOptionId))
    .map(option => option.set("isDisabled", option.get("disabled")));

  if (stickyOptionId) {
    const stickyOption = enabledOptions.find(option => option.get("unique_id") === stickyOptionId);

    if (!stickyOption && !filtersChanged) {
      return options.push(
        fromJS({
          unique_id: stickyOptionId,
          name: stickyOptionId,
          isDisabled: true
        })
      );
    }
  }

  return enabledOptions;
};

export const appendDisabledUser = (users, userName) =>
  userName && !users?.map(user => user.get("user_name")).includes(userName)
    ? users?.push(fromJS({ user_name: userName, isDisabled: true }))
    : users;

export const getConnectedFields = () => ({
  service: SERVICE_SECTION_FIELDS.type,
  agency: SERVICE_SECTION_FIELDS.implementingAgency,
  location: SERVICE_SECTION_FIELDS.deliveryLocation,
  user: SERVICE_SECTION_FIELDS.implementingAgencyIndividual
});

export const handleChangeOnServiceUser = ({
  agencies,
  data,
  form,
  referralUsers,
  reportingLocations,
  setFilterState
}) => {
  const selectedUser = referralUsers.find(user => user.get("user_name") === data?.value);

  if (selectedUser?.size) {
    const userAgency = selectedUser.get("agency");
    const userLocation = selectedUser.get("location");

    if (agencies.find(current => current.get("unique_id") === userAgency && !current.get("disabled"))) {
      form.setFieldValue(getConnectedFields().agency, userAgency, false);
    }

    if (reportingLocations.find(current => current.get("code") === userLocation)) {
      form.setFieldValue(getConnectedFields().location, userLocation, false);
    }
  }

  setFilterState({ filtersChanged: true, userIsSelected: true });
};

export const translatedText = (displayText, i18n) => {
  return displayText instanceof Object ? displayText?.[i18n.locale] || "" : displayText;
};

export const findOptionDisplayText = ({ agencies, customLookups, i18n, option, options, value }) => {
  const foundOptions = find(options, { id: value }) || {};
  let optionValue = [];

  if (Object.keys(foundOptions).length && !customLookups.includes(option)) {
    optionValue = translatedText(foundOptions.display_text, i18n);
  } else if (option === CUSTOM_STRINGS_SOURCE.agency) {
    optionValue = value ? agencies.find(a => a.get("id") === value)?.get("name") : value;
  } else {
    optionValue = "";
  }

  return optionValue;
};

export const buildCustomLookupsConfig = ({
  agencies,
  filterState,
  locations,
  name,
  referralUsers,
  reportingLocations,
  stickyOptionId,
  value
}) => ({
  Location: {
    fieldLabel: NAME_FIELD,
    fieldValue: CODE_FIELD,
    options: locations
  },
  Agency: {
    fieldLabel: NAME_FIELD,
    fieldValue: UNIQUE_ID_FIELD,
    options: withStickyOption(agencies, stickyOptionId, filterState?.filtersChanged)
  },
  ReportingLocation: {
    fieldLabel: NAME_FIELD,
    fieldValue: CODE_FIELD,
    options: reportingLocations
  },
  User: {
    fieldLabel: "user_name",
    fieldValue: "user_name",
    options:
      !filterState?.filtersChanged && name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)
        ? appendDisabledUser(referralUsers, value)
        : referralUsers
  }
});

export const serviceHasReferFields = service => {
  if (!service) {
    return false;
  }

  const {
    service_implementing_agency_individual: serviceImplementingAgencyIndividual,
    service_external_referral: serviceExternalReferral
  } = service;

  return serviceImplementingAgencyIndividual || serviceExternalReferral;
};

export const serviceIsReferrable = (service, services, agencies, users = []) => {
  const {
    service_external_referral: serviceExternalReferral,
    service_type: serviceType,
    service_implementing_agency: agencyUniqueId,
    service_implementing_agency_individual: userName
  } = service;

  if (serviceExternalReferral) {
    return true;
  }

  if (services.find(type => type.id === serviceType)) {
    const serviceUser = users.find(
      user => user.get("user_name") === userName && user.get("services")?.includes(serviceType)
    );

    if (serviceUser && agencyUniqueId) {
      const serviceAgency = agencies.find(
        agency => agency.get("unique_id") === agencyUniqueId && agency.get("services")?.includes(serviceType)
      );

      if (!serviceAgency) {
        return false;
      }

      return serviceUser.get("agency") === agencyUniqueId;
    }

    if (serviceUser) {
      return true;
    }
  }

  return false;
};

export const getSubformValues = (field, index, values, orderedValues = []) => {
  const { subform_section_configuration: subformSectionConfiguration } = field;

  const { display_conditions: displayConditions } = subformSectionConfiguration || {};

  if (index === 0 || index > 0) {
    if (displayConditions) {
      return valuesWithDisplayConditions(getIn(values, field.name), displayConditions)[index];
    }

    return isEmpty(orderedValues) ? getIn(values, `${field.name}[${index}]`) : orderedValues[index];
  }

  return {};
};

// This method checks if the form is dirty or not. With the existing behavior
// of 'dirty' prop from formik when you update a subform, the form never gets
// 'dirty'. Also, subforms are sorted before comparing them because the subforms
// that are set into the 'initialValues' they got a different order than current
// values (formik.getValues()).

export const isFormDirty = (initialValues, currentValues, fields) => {
  if (isEmpty(fields)) {
    return false;
  }

  return !isEqual(sortSubformsValues(initialValues, fields), sortSubformsValues(currentValues, fields));
};

export const getRecordInformationForms = i18n => ({
  [RECORD_OWNER]: FormSectionRecord({
    unique_id: RECORD_OWNER,
    name: { [i18n.locale]: i18n.t("forms.record_types.record_information") },
    order: 1,
    form_group_id: RECORD_INFORMATION_GROUP,
    order_form_group: 0,
    is_first_tab: true
  }),
  [APPROVALS]: FormSectionRecord({
    unique_id: APPROVALS,
    name: { [i18n.locale]: i18n.t("forms.record_types.approvals") },
    order: 2,
    form_group_id: RECORD_INFORMATION_GROUP,
    order_form_group: 0,
    is_first_tab: true
  }),
  [INCIDENT_FROM_CASE]: FormSectionRecord({
    unique_id: INCIDENT_FROM_CASE,
    name: { [i18n.locale]: i18n.t("incidents.label") },
    order: 2,
    form_group_id: RECORD_INFORMATION_GROUP,
    order_form_group: 0,
    is_first_tab: false
  }),
  [REFERRAL]: FormSectionRecord({
    unique_id: REFERRAL,
    name: { [i18n.locale]: i18n.t("forms.record_types.referrals") },
    order: 3,
    form_group_id: RECORD_INFORMATION_GROUP,
    order_form_group: 0,
    is_first_tab: true
  }),
  [TRANSFERS_ASSIGNMENTS]: FormSectionRecord({
    unique_id: TRANSFERS_ASSIGNMENTS,
    name: { [i18n.locale]: i18n.t("forms.record_types.transfers_assignments") },
    order: 4,
    form_group_id: RECORD_INFORMATION_GROUP,
    order_form_group: 0,
    is_first_tab: false
  }),
  [CHANGE_LOGS]: FormSectionRecord({
    unique_id: CHANGE_LOGS,
    name: { [i18n.locale]: i18n.t("change_logs.label") },
    order: 4,
    form_group_id: RECORD_INFORMATION_GROUP,
    order_form_group: 0,
    is_first_tab: false
  })
});
