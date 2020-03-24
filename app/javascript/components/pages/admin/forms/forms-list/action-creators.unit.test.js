import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import * as actionCreators from "./action-creators";
import actions from "./actions";

chai.use(sinonChai);

describe("<FormsList /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actionCreators };

    expect(creators).to.have.property("fetchForms");

    delete creators.fetchForms;

    expect(creators).to.deep.equal({});
  });

  it("should check the 'fetchForms' action creator to return the correct object", () => {
    const store = configureStore([thunk])({});

    const expected = {
      type: actions.RECORD_FORMS,
      api: { path: "forms", normalizeFunc: "normalizeFormData" }
    };

    expect(store.dispatch(actionCreators.fetchForms())).to.deep.equal(expected);
  });
});
