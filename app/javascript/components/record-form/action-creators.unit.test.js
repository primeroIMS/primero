import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";

import * as actionCreators from "./action-creators";
import actions from "./actions";
import { URL_LOOKUPS } from "./constants";

chai.use(sinonChai);

describe("<RecordForm /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("setSelectedForm");
    expect(creators).to.have.property("setSelectedRecord");
    expect(creators).to.have.property("fetchForms");
    expect(creators).to.have.property("fetchOptions");

    delete creators.setSelectedForm;
    delete creators.setSelectedRecord;
    delete creators.fetchForms;
    delete creators.fetchOptions;

    expect(creators).to.deep.equal({});
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
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchForms()(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql("forms/RECORD_FORMS");
    expect(dispatch.getCall(0).returnValue.api.path).to.eql("forms");
    expect(typeof dispatch.getCall(0).returnValue.api.normalizeFunc).to.eql(
      "string"
    );
  });

  it("should check the 'fetchOptions' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchOptions()(dispatch);

    const firstCallReturnValue = dispatch.getCall(0).returnValue;
    const secondCallReturnValue = dispatch.getCall(1).returnValue;

    expect(firstCallReturnValue.type).to.eql(actions.SET_OPTIONS);
    expect(firstCallReturnValue.api.path).to.eql(URL_LOOKUPS);
    expect(secondCallReturnValue.type).to.eql(actions.SET_LOCATIONS);
  });
});
