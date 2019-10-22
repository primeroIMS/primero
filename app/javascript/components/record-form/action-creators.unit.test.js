import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import * as actionCreators from "./action-creators";

chai.use(sinonChai);

describe("<RecordForm /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("setSelectedForm");
    expect(creators).to.have.property("fetchForms");
    expect(creators).to.have.property("fetchOptions");

    delete creators.setSelectedForm;
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

  it("should check the 'fetchForms' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const action = actionCreators.fetchForms()(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql("forms/RECORD_FORMS");
    expect(dispatch.getCall(0).returnValue.api.path).to.eql("forms");
    expect(typeof dispatch.getCall(0).returnValue.api.normalizeFunc).to.eql(
      "string"
    );
    expect(action).to.be.an.instanceof(Promise);
  });

  it("should check the 'fetchOptions' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const action = actionCreators.fetchOptions()(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql("forms/SET_OPTIONS");
    expect(dispatch.getCall(0).returnValue.payload.length).to.eql(63);
    expect(action).to.be.an.instanceof(Promise);
  });
});
