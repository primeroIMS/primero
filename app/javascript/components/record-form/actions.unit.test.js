import clone from "lodash/clone";

import actions from "./actions";

describe("<RecordForm /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = clone({ ...actions });

    [
      "FETCH_AGENCIES",
      "FETCH_AGENCIES_FAILURE",
      "FETCH_AGENCIES_FINISHED",
      "FETCH_AGENCIES_STARTED",
      "FETCH_AGENCIES_SUCCESS",
      "RECORD_FORMS",
      "RECORD_FORMS_FAILURE",
      "RECORD_FORMS_FINISHED",
      "RECORD_FORMS_STARTED",
      "RECORD_FORMS_SUCCESS",
      "SET_FORMS",
      "SET_LOCATIONS",
      "SET_LOCATIONS_FAILURE",
      "SET_LOCATIONS_FINISHED",
      "SET_LOCATIONS_STARTED",
      "SET_LOCATIONS_SUCCESS",
      "SET_OPTIONS",
      "SET_OPTIONS_FAILURE",
      "SET_OPTIONS_FINISHED",
      "SET_OPTIONS_STARTED",
      "SET_OPTIONS_SUCCESS",
      "SET_SELECTED_FORM",
      "SET_SELECTED_RECORD",
      "SET_SERVICE_TO_REFER"
    ].forEach(property => {
      expect(cloneActions).to.have.property(property);
      delete cloneActions[property];
    });

    expect(cloneActions).to.be.empty;
  });
});
