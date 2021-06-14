import { mock, spy } from "../../../../test";

import getConnectedFields from "./get-connected-fields";
import handleChangeOnServiceUser from "./handle-change-service-user";

describe("handleChangeOnServiceUser", () => {
  it("should set the connected fields when the user is changed", () => {
    const setFieldValue = spy();
    const setFilterState = mock();
    const agencies = [{ id: "agency-1" }];
    const referralUsers = [{ id: "user-1", agency: "agency-1", location: "location-1" }];
    const reportingLocations = [{ code: "location-1" }];

    setFieldValue.calledWith(getConnectedFields(0).agency, "agency-1", false);

    setFieldValue.calledWith(getConnectedFields(0).location, "location-1", false);

    handleChangeOnServiceUser({
      agencies,
      data: { id: "user-1" },
      setFieldValue,
      index: 0,
      referralUsers,
      reportingLocations,
      setFilterState
    });
  });
});
