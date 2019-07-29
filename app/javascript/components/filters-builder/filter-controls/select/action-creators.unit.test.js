import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import * as actionCreators from "./action-creators";

chai.use(sinonChai);

describe("<SelectFilter /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    expect(creators).to.have.property("setupSelect");
    expect(creators).to.have.property("setSelectValue");
    delete creators.setupSelect;
    delete creators.setSelectValue;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'setupSelect' action creator to return the correct object", () => {
    const options = { status: [] };
    const dispatch = sinon.spy(actionCreators, "setupSelect");

    actionCreators.setupSelect({ status: [] }, "Cases");

    expect(dispatch.getCall(0).returnValue).to.eql({
      type: "Cases/SET_FILTERS",
      payload: options
    });
  });

  it("should check the 'setSelectValue' action creator to return the correct object", () => {
    const dispatch = sinon.spy(actionCreators, "setSelectValue");
    const options = { id: "approval_status", data: ["bia"] };

    actionCreators.setSelectValue({ id: "approval_status", data: ["bia"] }, "Cases");

    expect(dispatch.getCall(0).returnValue).to.eql({
      type: "Cases/ADD_SELECT",
      payload: options
    });
  });

});