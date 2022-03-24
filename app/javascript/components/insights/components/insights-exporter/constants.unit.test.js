import * as constants from "./constants";

describe("insights/components/insights-exporter/constants", () => {
  const clone = { ...constants };

  after(() => {
    expect(clone).to.be.empty;
  });

  ["NAME", "FORM_ID", "EXPORTED_URL"].forEach(property => {
    it(`exports property '${property}'`, () => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });
  });
});
