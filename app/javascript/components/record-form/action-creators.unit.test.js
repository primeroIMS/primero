import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actionCreators from "./action-creators";
import actions from "./actions";
import { URL_LOOKUPS } from "./constants";

chai.use(sinonChai);

describe("<RecordForm /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    [
      "setSelectedForm",
      "setSelectedRecord",
      "fetchForms",
      "fetchOptions",
      "fetchLookups"
    ].forEach(property => {
      expect(creators).to.have.property(property);
      expect(creators[property]).to.be.a("function");
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check the 'setSelectedForm' action creator to return the correct object", () => {
    const options = "referral_transfer";
    const dispatch = sinon.spy(actionCreators, "setSelectedForm");

    actionCreators.setSelectedForm("referral_transfer");

    expect(dispatch.getCall(0).returnValue).to.eql({
      type: "forms/SET_SELECTED_FORM",
      payload: options
    });
  });

  it("should check the 'setSelectedRecord' action creator to return the correct object", () => {
    const options = "123";
    const dispatch = sinon.spy(actionCreators, "setSelectedRecord");

    actionCreators.setSelectedRecord("123");

    expect(dispatch.getCall(0).returnValue).to.eql({
      type: "forms/SET_SELECTED_RECORD",
      payload: options
    });
  });

  it("should check the 'fetchForms' action creator to return the correct object", () => {
    const store = configureStore([thunk])({});

    return store.dispatch(actionCreators.fetchForms()).then(() => {
      const expectedActions = store.getActions();

      expect(expectedActions[0].type).to.eql("forms/RECORD_FORMS");
      expect(expectedActions[0].api.path).to.eql("forms");
      expect(expectedActions[0].api.normalizeFunc).to.eql("normalizeFormData");
    });
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

  it("should check the 'fetchLookups' action creator to return the correct object", () => {
    const dispatch = sinon.spy(actionCreators, "fetchLookups");

    actionCreators.fetchLookups();

    expect(dispatch.getCall(0).returnValue).to.eql({
      api: {
        db: {
          collection: "options"
        },
        params: {
          page: 1,
          per: 999
        },
        path: "lookups"
      },
      type: "forms/SET_OPTIONS"
    });
  });
});
