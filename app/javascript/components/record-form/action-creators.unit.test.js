import clone from "lodash/clone";
import sinon from "sinon";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actionCreators from "./action-creators";
import actions from "./actions";
import { URL_LOOKUPS } from "./constants";

describe("<RecordForm /> - Action Creators", () => {
  let dispatch;

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
    dispatch?.restore();
  });

  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    [
      "clearDataProtectionInitialValues",
      "clearValidationErrors",
      "fetchAgencies",
      "fetchForms",
      "fetchLookups",
      "fetchOptions",
      "setDataProtectionInitialValues",
      "setSelectedForm",
      "setServiceToRefer",
      "setValidationErrors",
      "setPreviousRecord",
      "clearPreviousRecord"
    ].forEach(property => {
      expect(creators).to.have.property(property);
      expect(creators[property]).to.be.a("function");
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check the 'setSelectedForm' action creator to return the correct object", () => {
    const options = "referral_transfer";

    dispatch = sinon.spy(actionCreators, "setSelectedForm");

    actionCreators.setSelectedForm("referral_transfer");

    expect(dispatch.getCall(0).returnValue).to.eql({
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

    expect(actionCreators.fetchForms()).to.deep.equal(expected);
  });

  it("should check the 'fetchOptions' action creator to return the correct object", () => {
    const store = configureStore([thunk])({});

    return store.dispatch(actionCreators.fetchOptions()).then(() => {
      const expectedActions = store.getActions();

      expect(expectedActions[0].type).to.eql(actions.SET_OPTIONS);
      expect(expectedActions[0].api.path).to.eql(URL_LOOKUPS);
      expect(expectedActions[1].type).to.eql(actions.SET_LOCATIONS);
    });
  });

  it("should check the 'fetchOptions' action creator to return the correct object when no location manifest", () => {
    const store = configureStore([thunk])({});
    const locationRef = global.window.locationManifest;

    global.window.locationManifest = [];

    return store.dispatch(actionCreators.fetchOptions()).then(() => {
      expect(store.getActions()).to.eql([setOptionsAction]);

      global.window.locationManifest = locationRef;
    });
  });

  it("should check the 'fetchLookups' action creator to return the correct object", () => {
    dispatch = sinon.spy(actionCreators, "fetchLookups");

    actionCreators.fetchLookups();

    expect(dispatch.getCall(0).returnValue).to.eql(setOptionsAction);
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
    ).to.deep.equals(expected);
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

    expect(actionCreators.fetchAgencies()).to.deep.equals(expected);
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

    expect(actionCreators.setValidationErrors(validationErrors)).to.deep.equals(expected);
  });

  it("should check the 'clearValidationErrors' action creator return the correct object", () => {
    const expected = { type: actions.CLEAR_VALIDATION_ERRORS };

    expect(actionCreators.clearValidationErrors()).to.deep.equals(expected);
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

    expect(actionCreators.setDataProtectionInitialValues(payload)).to.deep.equals(expected);
  });

  it("should check the 'clearDataProtectionInitialValues' action creator return the correct object", () => {
    const expected = { type: actions.CLEAR_DATA_PROTECTION_INITIAL_VALUES };

    expect(actionCreators.clearDataProtectionInitialValues()).to.deep.equals(expected);
  });
});
