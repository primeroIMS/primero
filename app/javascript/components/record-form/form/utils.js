import find from "lodash/find";
import { fromJS } from "immutable";

import { SERVICE_SECTION_FIELDS } from "../../record-actions/transitions/components/referrals";
import { CODE_FIELD, NAME_FIELD, UNIQUE_ID_FIELD } from "../../../config";

import { CUSTOM_STRINGS_SOURCE } from "./constants";

export const appendDisabledAgency = (agencies, agencyUniqueId) =>
  agencyUniqueId &&
  !agencies.map(agency => agency.get("unique_id")).includes(agencyUniqueId)
    ? agencies.push(
        fromJS({
          unique_id: agencyUniqueId,
          name: agencyUniqueId,
          isDisabled: true
        })
      )
    : agencies;

export const appendDisabledUser = (users, userName) =>
  userName && !users?.map(user => user.get("user_name")).includes(userName)
    ? users?.push(fromJS({ user_name: userName, isDisabled: true }))
    : users;

export const getConnectedFields = index => {
  if (index >= 0) {
    return {
      service: `services_section[${index}]${SERVICE_SECTION_FIELDS.type}`,
      agency: `services_section[${index}]${SERVICE_SECTION_FIELDS.implementingAgency}`,
      location: `services_section[${index}]${SERVICE_SECTION_FIELDS.deliveryLocation}`,
      user: `services_section[${index}]${SERVICE_SECTION_FIELDS.implementingAgencyIndividual}`
    };
  }

  return {
    service: SERVICE_SECTION_FIELDS.type,
    agency: SERVICE_SECTION_FIELDS.implementingAgency,
    location: SERVICE_SECTION_FIELDS.deliveryLocation,
    user: SERVICE_SECTION_FIELDS.implementingAgencyIndividual
  };
};

export const handleChangeOnServiceUser = ({
  agencies,
  data,
  form,
  index,
  referralUsers,
  reportingLocations,
  setFilterState
}) => {
  const selectedUser = referralUsers.find(
    user => user.get("user_name") === data?.value
  );

  if (selectedUser?.size) {
    const userAgency = selectedUser.get("agency");
    const userLocation = selectedUser.get("location");

    if (agencies.find(current => current.get("unique_id") === userAgency)) {
      form.setFieldValue(getConnectedFields(index).agency, userAgency, false);
    }

    if (
      reportingLocations.find(current => current.get("code") === userLocation)
    ) {
      form.setFieldValue(
        getConnectedFields(index).location,
        userLocation,
        false
      );
    }
  }

  setFilterState({ filtersChanged: true, userIsSelected: true });
};

export const translatedText = (displayText, i18n) => {
  return displayText instanceof Object
    ? displayText?.[i18n.locale] || ""
    : displayText;
};

export const findOptionDisplayText = ({
  agencies,
  customLookups,
  i18n,
  option,
  options,
  value
}) => {
  const foundOptions = find(options, { id: value }) || {};
  let optionValue = [];

  if (Object.keys(foundOptions).length && !customLookups.includes(option)) {
    optionValue = translatedText(foundOptions.display_text, i18n);
  } else if (option === CUSTOM_STRINGS_SOURCE.agency) {
    optionValue = value
      ? agencies.find(a => a.get("id") === value)?.get("name")
      : value;
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
    options:
      !filterState?.filtersChanged &&
      name.endsWith(SERVICE_SECTION_FIELDS.implementingAgency)
        ? appendDisabledAgency(agencies, value)
        : agencies
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
      !filterState?.filtersChanged &&
      name.endsWith(SERVICE_SECTION_FIELDS.implementingAgencyIndividual)
        ? appendDisabledUser(referralUsers, value)
        : referralUsers
  }
});

export const serviceHasReferFields = service => {
  if (!service) {
    return false;
  }

  return (
    service.service_response_type &&
    service.service_type &&
    service.service_implementing_agency_individual
  );
};

export const serviceIsReferrable = (
  service,
  services,
  agencies,
  users = []
) => {
  const {
    service_type: serviceType,
    service_implementing_agency: agencyUniqueId,
    service_implementing_agency_individual: userName
  } = service;

  if (services.find(type => type.id === serviceType)) {
    const serviceUser = users.find(
      user =>
        user.get("user_name") === userName &&
        user.get("services")?.includes(serviceType)
    );

    if (serviceUser && agencyUniqueId) {
      const serviceAgency = agencies.find(
        agency =>
          agency.get("unique_id") === agencyUniqueId &&
          agency.get("services")?.includes(serviceType)
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
