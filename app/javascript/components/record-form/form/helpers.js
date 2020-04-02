import find from "lodash/find";
import { fromJS } from "immutable";

import { CODE_FIELD, NAME_FIELD, UNIQUE_ID_FIELD } from "../../../config";

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
  userName && !users.map(user => user.get("user_name")).includes(userName)
    ? users.push(fromJS({ user_name: userName, isDisabled: true }))
    : users;

export const getConnectedFields = index => {
  const connectedFields = {
    service: "service_type",
    agency: "service_implementing_agency",
    location: "service_delivery_location",
    user: "service_implementing_agency_individual"
  };

  if (index >= 0) {
    return {
      service: `services_section[${index}]${connectedFields.service}`,
      agency: `services_section[${index}]${connectedFields.agency}`,
      location: `services_section[${index}]${connectedFields.location}`,
      user: `services_section[${index}]${connectedFields.user}`
    };
  }

  return connectedFields;
};

export const handleChangeOnServiceUser = ({
  setFilterState,
  referralUsers,
  data,
  agencies,
  reportingLocations,
  form,
  index
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
  return typeof displayText === "string"
    ? displayText
    : displayText[i18n.locale];
};

export const findOptionDisplayText = ({
  agencies,
  customLookups,
  options,
  option,
  value,
  i18n
}) => {
  const foundOptions = find(options, { id: value }) || {};
  let optionValue = [];

  if (Object.keys(foundOptions).length && !customLookups.includes(option)) {
    optionValue = translatedText(foundOptions.display_text, i18n);
  } else if (option === "Agency") {
    optionValue = value
      ? agencies.find(a => a.get("id") === value)?.get("name")
      : value;
  } else {
    optionValue = "";
  }

  return optionValue;
};

export const buildCustomLookupsConfig = ({
  locations,
  reportingLocations,
  agencies,
  referralUsers,
  filterState,
  value
}) => ({
  Location: {
    options: locations,
    fieldValue: CODE_FIELD,
    fieldLabel: NAME_FIELD
  },
  Agency: {
    options: !filterState?.filtersChanged
      ? appendDisabledAgency(agencies, value)
      : agencies,
    fieldValue: UNIQUE_ID_FIELD,
    fieldLabel: NAME_FIELD
  },
  ReportingLocation: {
    options: reportingLocations,
    fieldValue: CODE_FIELD,
    fieldLabel: NAME_FIELD
  },
  User: {
    options: !filterState?.filtersChanged
      ? appendDisabledUser(referralUsers, value)
      : referralUsers,
    fieldValue: "user_name",
    fieldLabel: "user_name"
  }
});

export const serviceHasReferFields = service => {
  return (
    service.service_response_type &&
    service.service_type &&
    service.service_implementing_agency_individual
  );
};

export const serviceIsReferrable = (service, services, agencies, users) => {
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
