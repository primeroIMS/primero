import * as constants from "./constants";

describe("<CasesBySocialWorker> - pages/dashboard/components/cases-by-social-worker/constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["NAME", "CASES_BY_SOCIAL_WORKER_COLUMNS"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
