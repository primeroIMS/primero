import { SERVICE_SECTION_FIELDS } from "../../../record-actions/transitions/components/referrals";

import getConnectedFields from "./get-connected-fields";

describe("getConnectedFields", () => {
  it("should know the connected fields", () => {
    const connectedFields = { ...getConnectedFields() };

    ["service", "agency", "location", "user"].forEach(property => {
      expect(connectedFields).to.have.property(property);
      delete connectedFields[property];
    });

    expect(connectedFields).to.deep.equal({});
  });

  it("should return the connected fields", () => {
    const expected = {
      service: SERVICE_SECTION_FIELDS.type,
      agency: SERVICE_SECTION_FIELDS.implementingAgency,
      location: SERVICE_SECTION_FIELDS.deliveryLocation,
      user: SERVICE_SECTION_FIELDS.implementingAgencyIndividual
    };

    const connectedFields = getConnectedFields();

    expect(connectedFields).to.deep.equal(expected);
  });
});
