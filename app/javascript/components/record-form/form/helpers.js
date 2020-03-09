import { fromJS } from "immutable";

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
