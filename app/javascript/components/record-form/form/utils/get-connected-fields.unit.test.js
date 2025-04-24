// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { SERVICE_SECTION_FIELDS } from "../../../record-actions/transitions/components/referrals";

import getConnectedFields from "./get-connected-fields";

describe("getConnectedFields", () => {
  it("should know the connected fields", () => {
    const connectedFields = { ...getConnectedFields() };

    ["service", "agency", "location", "user"].forEach(property => {
      expect(connectedFields).toHaveProperty(property);
      delete connectedFields[property];
    });

    expect(connectedFields).toEqual({});
  });

  it("should return the connected fields", () => {
    const expected = {
      service: SERVICE_SECTION_FIELDS.type,
      agency: SERVICE_SECTION_FIELDS.implementingAgency,
      location: SERVICE_SECTION_FIELDS.deliveryLocation,
      user: SERVICE_SECTION_FIELDS.implementingAgencyIndividual
    };

    const connectedFields = getConnectedFields();

    expect(connectedFields).toEqual(expected);
  });
});
