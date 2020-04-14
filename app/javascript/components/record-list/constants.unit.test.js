import * as constants from "./constants";

describe("<RecordList /> - constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    ["NAME", "ALERTS", "ALERTS_COLUMNS", "FILTER_CONTAINER_NAME"].forEach(
      property => {
        expect(clone).to.have.property(property);
        delete clone[property];
      }
    );

    expect("Deprecated RECORD_LIST_ACTIONS_NAME", clone).to.not.have.property(
      "RECORD_LIST_ACTIONS_NAME"
    );

    expect(clone).to.be.empty;
  });
});
