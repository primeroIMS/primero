// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<RecordList /> - constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
    [
      "ALERTS",
      "ALERTS_COLUMNS",
      "DEFAULT_FILTERS",
      "FILTER_CONTAINER_NAME",
      "ID_COLUMNS",
      "NAME",
      "SEARCH_OR_CREATE_FILTERS",
      "SEARCH_AND_CREATE_WORKFLOW",
      "COMPLETE"
    ].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    // clone
    expect("Deprecated RECORD_LIST_ACTIONS_NAME").not.toHaveProperty("RECORD_LIST_ACTIONS_NAME");

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
