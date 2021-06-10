import isEmpty from "lodash/isEmpty";

import getConnectedFields from "./get-connected-fields";

export default ({ agencies, data, setFieldValue, referralUsers, reportingLocations, setFilterState }) => {
  const selectedUser = referralUsers.find(user => user.id === data?.id);

  if (!isEmpty(selectedUser)) {
    const userAgency = selectedUser.agency;
    const userLocation = selectedUser.location;

    if (agencies.find(current => current.id === userAgency && !current.disabled)) {
      setFieldValue(getConnectedFields().agency, userAgency, false);
    }

    if (reportingLocations.find(current => current.code === userLocation)) {
      setFieldValue(getConnectedFields().location, userLocation, false);
    }
  }

  setFilterState({ filtersChanged: true, userIsSelected: true });
};
