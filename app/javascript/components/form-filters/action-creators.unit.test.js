import * as actionCreators from "./action-creators";
import * as actions from "./actions";

describe("components/form-filters/action-creators.js", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    ["clearFormFilters", "setFormFilters"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should create an action to set the form filters", () => {
    const payload = {
      formName: "someForm",
      filters: {
        filter_1: ["value_1", "value_2"]
      }
    };

    const expectedAction = {
      type: actions.SET_FORM_FILTERS,
      payload
    };

    expect(actionCreators.setFormFilters("someForm", { filter_1: ["value_1", "value_2"] })).to.eql(expectedAction);
  });

  it("should create an action to clear the filters", () => {
    const expectedAction = {
      type: actions.CLEAR_FORM_FILTERS,
      payload: "someForm"
    };

    expect(actionCreators.clearFormFilters("someForm")).to.eql(expectedAction);
  });
});
