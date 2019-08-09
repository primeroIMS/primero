import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import * as actionCreators from "./action-creators";

chai.use(sinonChai);

describe("<CheckBox /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("setUpCheckBoxes");
    expect(creators).to.have.property("setCheckBox");
    delete creators.setUpCheckBoxes;
    delete creators.setCheckBox;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'setUpCheckBoxes' action creator to return the correct object", () => {
    const options = { my_cases: [] };
    const dispatch = sinon.spy(actionCreators, "setUpCheckBoxes");

    actionCreators.setUpCheckBoxes({ my_cases: [] }, "Cases");

    expect(dispatch.getCall(0).returnValue).to.eql({ 
      type: "Cases/SET_FILTERS",
      payload: options
    });
  });

  describe("should check setCheckBox to return the correct object", () => {
    const dispatch = sinon.spy(actionCreators, "setCheckBox");
    it("when checkbox is not included", () => {
      const options = { id: "my_cases", included: false, data: "my_cases" };

      actionCreators.setCheckBox({
        id: "my_cases",
        included: false,
        data: "my_cases"
      }, "Cases");

      expect(dispatch.getCall(0).returnValue).to.eql({
        type: "Cases/ADD_CHECKBOX",
        payload: options
      });
    });

    it("when checkbox is included", () => {
      const options = { id: "my_cases", included: true, data: "my_cases" };

      actionCreators.setCheckBox({
        id: "my_cases",
        included: true,
        data: "my_cases"
      }, "Cases");

      expect(dispatch.getCall(1).returnValue).to.eql({
        type: "Cases/DELETE_CHECKBOX",
        payload: options
      });
    });
  });
});