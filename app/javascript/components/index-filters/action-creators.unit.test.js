import { expect } from "chai";
import sinon from "sinon";
import configureStore from "redux-mock-store";

import { RECORD_PATH } from "../../config";

import * as actions from "./action-creators";

describe("<IndexFilters /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = { ...actions };

    ["applyFilters", "setFilters"].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });

    expect(creators).to.be.empty;
  });

  it("should check the 'setFilters' action creator to return the correct object, when applying filters", () => {
    const options = { filter1: true };
    const expectedAction = {
      payload: options,
      type: "cases/SET_FILTERS"
    };

    expect(
      actions.setFilters({
        recordType: "cases",
        data: { filter1: true }
      })
    ).to.deep.equal(expectedAction);
  });

  it("checks 'applyFilters' action creator returns the correct object, when applying filters/fetching records", () => {
    const options = { filter1: true };
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    actions.applyFilters({
      recordType: "cases",
      data: { filter1: true }
    })(dispatch);

    expect(dispatch).to.have.been.calledWithMatch({
      payload: options,
      type: "cases/SET_FILTERS"
    });

    expect(dispatch).to.have.been.calledWithMatch({
      api: {
        params: options,
        path: `/${RECORD_PATH.cases}`
      },
      type: "cases/RECORDS"
    });
  });
});
