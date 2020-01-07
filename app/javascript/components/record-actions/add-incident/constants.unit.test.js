import { expect } from "chai";

import * as incidentsConstants from "./constants";

describe("<AddIncident /> - constants", () => {
  it("should have known constant", () => {
    const constants = { ...incidentsConstants };

    ["NAME", "FIELDS_NAME", "INCIDENT_SUBFORM"].forEach(property => {
      expect(constants).to.have.property(property);
      delete constants[property];
    });

    expect(constants).to.be.empty;
  });
});
