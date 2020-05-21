import * as constants from "./constants";

describe("<RecordList /> - constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
    [
      "ALERTS",
      "ALERTS_COLUMNS",
      "DEFAULT_FILTERS",
      "FILTER_CONTAINER_NAME",
      "NAME"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect("Deprecated RECORD_LIST_ACTIONS_NAME", clone).to.not.have.property(
      "RECORD_LIST_ACTIONS_NAME"
    );

    expect(clone).to.be.empty;
  });
});
