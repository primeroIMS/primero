import { expect } from "../../../../../test/unit-test-helpers";

import * as actionCreators from "./action-creators";
import actions from "./actions";

describe("<FormsList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    actionCreators.forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty({});
  });

  it("should check the 'fetchForms' action creator to return the correct object", () => {
    const expected = {
      type: actions.RECORD_FORMS,
      api: { path: "forms", normalizeFunc: "normalizeFormData" }
    };

    expect(actionCreators.fetchForms()).to.deep.equal(expected);
  });
});
