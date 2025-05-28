// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actionCreators from "./action-creators";
import actions from "./actions";
import { URL_LOOKUPS } from "./constants";

jest.mock("./action-creators", () => {
  const originalModule = jest.requireActual("./action-creators");

  return {
    __esModule: true,
    ...originalModule
  };
});

describe("<RecordForm /> - Action Creators", () => {
  const setOptionsAction = {
    api: {
      params: {
        page: 1,
        per: 999
      },
      path: "lookups",
      db: {
        collection: "options"
      }
    },
    type: "forms/SET_OPTIONS"
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    delete creators.__esModule;

    [
      "clearDataProtectionInitialValues",
      "clearPreviousRecord",
      "clearValidationErrors",
      "fetchAgencies",
      "fetchForms",
      "fetchLookups",
      "fetchOptions",
      "setDataProtectionInitialValues",
      "setPreviousRecord",
      "setRedirectedToCreateNewRecord",
      "setSelectedForm",
      "setServiceToRefer",
      "setValidationErrors",
      "setTempInitialValues",
      "clearTempInitialValues"
    ].forEach(property => {
      expect(creators).toHaveProperty(property);
      expect(creators[property]).toBeInstanceOf(Function);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("should check the 'setSelectedForm' action creator to return the correct object", () => {
    const options = "referral_transfer";
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    dispatch(actionCreators.setSelectedForm("referral_transfer"));

    expect(dispatch.mock.calls[0][0]).toEqual({
      type: "forms/SET_SELECTED_FORM",
      payload: options
    });
  });

  it("should check the 'fetchForms' action creator to return the correct object", () => {
    const expected = {
      type: actions.RECORD_FORMS,
      api: {
        path: "forms",
        normalizeFunc: "normalizeFormData",
        db: {
          collection: "forms"
        }
      }
    };

    expect(actionCreators.fetchForms()).toEqual(expected);
  });

  it("should check the 'fetchOptions' action creator to return the correct object", () => {
    const store = configureStore([thunk])({});

    return store.dispatch(actionCreators.fetchOptions()).then(() => {
      const expectedActions = store.getActions();

      expect(expectedActions[0].type).toEqual(actions.SET_OPTIONS);
      expect(expectedActions[0].api.path).toEqual(URL_LOOKUPS);
      expect(expectedActions[1].type).toEqual(actions.SET_LOCATIONS);
    });
  });

  it("should check the 'fetchOptions' action creator to return the correct object when no location manifest", () => {
    const store = configureStore([thunk])({});
    const locationRef = global.window.locationManifest;

    global.window.locationManifest = [];

    return store.dispatch(actionCreators.fetchOptions()).then(() => {
      expect(store.getActions()).toEqual([setOptionsAction]);

      global.window.locationManifest = locationRef;
    });
  });

  it("should check the 'fetchLookups' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = jest.spyOn(store, "dispatch");

    dispatch(actionCreators.fetchLookups());

    expect(dispatch.mock.calls[0][0]).toEqual(setOptionsAction);
  });

  it("should check the 'setServiceToRefer' action creator return the correct object", () => {
    const expected = {
      type: actions.SET_SERVICE_TO_REFER,
      payload: {
        service_type: "service_1",
        service_implementing_agency: "agency_1"
      }
    };

    expect(
      actionCreators.setServiceToRefer({
        service_type: "service_1",
        service_implementing_agency: "agency_1"
      })
    ).toEqual(expected);
  });

  it("should check the 'fetchAgencies' action creator return the correct object", () => {
    const expected = {
      type: actions.FETCH_AGENCIES,
      api: {
        path: "agencies",
        method: "GET",
        params: undefined
      }
    };

    expect(actionCreators.fetchAgencies()).toEqual(expected);
  });

  it("should check the 'setValidationErrors' action creator return the correct object", () => {
    const validationErrors = [
      {
        unique_id: "form_1",
        form_group_id: "group_1",
        errors: {
          field_1: "field_1 is required"
        }
      }
    ];
    const expected = {
      type: actions.SET_VALIDATION_ERRORS,
      payload: validationErrors
    };

    expect(actionCreators.setValidationErrors(validationErrors)).toEqual(expected);
  });

  it("should check the 'clearValidationErrors' action creator return the correct object", () => {
    const expected = { type: actions.CLEAR_VALIDATION_ERRORS };

    expect(actionCreators.clearValidationErrors()).toEqual(expected);
  });

  it("should check the 'setDataProtectionInitialValues' action creator return the correct object", () => {
    const payload = {
      legitimate_basis: ["contract"],
      consent_agreements: ["consent_for_services"]
    };
    const expected = {
      type: actions.SET_DATA_PROTECTION_INITIAL_VALUES,
      payload
    };

    expect(actionCreators.setDataProtectionInitialValues(payload)).toEqual(expected);
  });

  it("should check the 'clearDataProtectionInitialValues' action creator return the correct object", () => {
    const expected = { type: actions.CLEAR_DATA_PROTECTION_INITIAL_VALUES };

    expect(actionCreators.clearDataProtectionInitialValues()).toEqual(expected);
  });

  it("checks the 'setRedirectedToCreateNewRecord' action creator return the correct object", () => {
    const expected = { type: actions.REDIRECTED_TO_CREATE_NEW_RECORD, payload: true };

    expect(actionCreators.setRedirectedToCreateNewRecord(true)).toEqual(expected);
  });
});
