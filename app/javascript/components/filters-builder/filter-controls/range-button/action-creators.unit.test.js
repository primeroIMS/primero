import { expect } from "chai";
import sinon from "sinon";

import * as actionCreators from "./action-creators";

describe("<RangeButton /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("setupRangeButton");
    expect(creators).to.have.property("setValue");
    delete creators.setupRangeButton;
    delete creators.setValue;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'setupRangeButton' action creator to return the correct object", () => {
    const options = { age_range: [] };
    const dispatch = sinon.spy(actionCreators, "setupRangeButton");

    actionCreators.setupRangeButton({ age_range: [] }, "Cases");

    expect(dispatch.getCall(0).returnValue).to.eql({
      type: "Cases/SET_FILTERS",
      payload: options
    });
  });

  it("should check the 'setValue' action creator to return the correct object", () => {
    const dispatch = sinon.spy(actionCreators, "setValue");
    const options = { id: "age_range", data: "age_6_11" };

    actionCreators.setValue({ id: "age_range", data: "age_6_11" }, "Cases");

    expect(dispatch.getCall(0).returnValue).to.eql({
      type: "Cases/ADD_RANGE_BUTTON",
      payload: options
    });
  });
});
