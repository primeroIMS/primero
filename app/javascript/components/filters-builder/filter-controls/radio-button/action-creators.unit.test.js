import { expect } from "chai";
import sinon from "sinon";

import * as actionCreators from "./action-creators";

describe("<RadioButton /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("setupRadioButtons");
    expect(creators).to.have.property("setRadioButton");
    delete creators.setupRadioButtons;
    delete creators.setRadioButton;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'setupRadioButtons' action creator to return the correct object", () => {
    const options = { age: [] };
    const dispatch = sinon.spy(actionCreators, "setupRadioButtons");

    actionCreators.setupRadioButtons({ age: [] }, "Cases");

    expect(dispatch.getCall(0).returnValue).to.eql({
      type: "Cases/SET_FILTERS",
      payload: options
    });
  });

  it("should check the 'setRadioButton' action creator to return the correct object", () => {
    const dispatch = sinon.spy(actionCreators, "setRadioButton");
    const options = { id: "sex", data: "female" };

    actionCreators.setRadioButton({ id: "sex", data: "female" }, "Cases");

    expect(dispatch.getCall(0).returnValue).to.eql({
      type: "Cases/ADD_RADIO_BUTTON",
      payload: options
    });
  });

});