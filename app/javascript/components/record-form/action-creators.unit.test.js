import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import { normalizeData } from "schemas";
import * as actionCreators from "./action-creators";
import * as actions from "./actions";

chai.use(sinonChai);

describe("<RecordForm /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("setSelectedForm");
    expect(creators).to.have.property("fetchForms");
    expect(creators).to.have.property("fetchRecord");
    expect(creators).to.have.property("fetchOptions");
    expect(creators).to.have.property("saveRecord");
    expect(creators).to.have.property("hideName")
    delete creators.setSelectedForm;
    delete creators.fetchForms;
    delete creators.fetchRecord;
    delete creators.fetchOptions;
    delete creators.saveRecord;
    delete creators.hideName;

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

    actionCreators.fetchForms()(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql("forms/RECORD_FORMS");
    expect(dispatch.getCall(0).returnValue.api.path).to.eql("forms");
    expect(typeof dispatch.getCall(0).returnValue.api.normalizeFunc).to.eql(
      "string"
    );
  });

  it("should check the 'fetchRecord' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchRecord("Cases", "123")(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql(
      "forms/SELECTED_RECORD"
    );
    expect(dispatch.getCall(0).returnValue.api.path).to.eql("Cases/123");
  });

  it("should check the 'fetchOptions' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actionCreators.fetchOptions()(dispatch);

    expect(dispatch.getCall(0).returnValue.type).to.eql("forms/SET_OPTIONS");
    expect(dispatch.getCall(0).returnValue.payload.length).to.eql(63);
  });

  describe("should check the 'saveRecord' action creator", () => {
    const body = {
      data: {
        name_first: "Gerald",
        name_last: "Padgett",
        name_given_post_separation: "true",
        registration_date: "2019-08-06",
        sex: "male",
        age: 26,
        date_of_birth: "1993-06-05",
        module_id: "primeromodule-cp"
      }
    };

    it("when path it's 'update' should return the correct object", () => {
      const store = configureStore()({});
      const dispatch = sinon.spy(store, "dispatch");

      actionCreators.saveRecord("Cases", "update", body, "123", () => {})(
        dispatch
      );

      expect(dispatch.getCall(0).returnValue.type).to.eql("forms/SAVE_RECORD");
      expect(dispatch.getCall(0).returnValue.api.path).to.eql("Cases/123");
      expect(dispatch.getCall(0).returnValue.api.method).to.eql("PATCH");
      expect(dispatch.getCall(0).returnValue.api.body).to.eql(body);
    });

    it("when path it's not 'update', the path and method should be different", () => {
      const store = configureStore()({});
      const dispatch = sinon.spy(store, "dispatch");

      actionCreators.saveRecord("Cases", "edit", body, "123", () => {})(
        dispatch
      );

      expect(dispatch.getCall(0).returnValue.type).to.eql("forms/SAVE_RECORD");
      expect(dispatch.getCall(0).returnValue.api.path).to.eql("Cases");
      expect(dispatch.getCall(0).returnValue.api.method).to.eql("POST");
      expect(dispatch.getCall(0).returnValue.api.body).to.eql(body);
    });
  });
});
