// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";

import actions from "./actions";

describe("<RecordForm /> - Actions", () => {
  it("should have known actions", () => {
    const cloneActions = clone({ ...actions });

    [
      "CLEAR_DATA_PROTECTION_INITIAL_VALUES",
      "CLEAR_PREVIOUS_RECORD",
      "CLEAR_VALIDATION_ERRORS",
      "FETCH_AGENCIES_FAILURE",
      "FETCH_AGENCIES_FINISHED",
      "FETCH_AGENCIES_STARTED",
      "FETCH_AGENCIES_SUCCESS",
      "FETCH_AGENCIES",
      "RECORD_FORMS_FAILURE",
      "RECORD_FORMS_FINISHED",
      "RECORD_FORMS_STARTED",
      "RECORD_FORMS_SUCCESS",
      "RECORD_FORMS",
      "REDIRECTED_TO_CREATE_NEW_RECORD",
      "SET_DATA_PROTECTION_INITIAL_VALUES",
      "SET_FORMS",
      "SET_LOCATIONS_FAILURE",
      "SET_LOCATIONS_FINISHED",
      "SET_LOCATIONS_STARTED",
      "SET_LOCATIONS_SUCCESS",
      "SET_LOCATIONS",
      "SET_OPTIONS_FAILURE",
      "SET_OPTIONS_FINISHED",
      "SET_OPTIONS_STARTED",
      "SET_OPTIONS_SUCCESS",
      "SET_OPTIONS",
      "SET_PREVIOUS_RECORD",
      "SET_SELECTED_FORM",
      "SET_SELECTED_RECORD",
      "SET_SERVICE_TO_REFER",
      "SET_VALIDATION_ERRORS",
      "SET_TEMP_INTIAL_VALUES",
      "CLEAR_TEMP_INTIAL_VALUES"
    ].forEach(property => {
      expect(cloneActions).toHaveProperty(property);
      delete cloneActions[property];
    });

    expect(Object.keys(cloneActions)).toHaveLength(0);
  });
});
