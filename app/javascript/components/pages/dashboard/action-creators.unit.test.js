import clone from "lodash/clone";
import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import configureStore from "redux-mock-store";

import { RECORD_PATH } from "../../../config";

import * as actionCreators from "./action-creators";
import * as Actions from "./actions";

chai.use(sinonChai);

describe("<Dashboard /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    [
      "fetchFlags",
      "fetchCasesByStatus",
      "fetchCasesByCaseWorker",
      "fetchCasesRegistration",
      "fetchCasesOverview",
      "fetchServicesStatus",
      "openPageActions",
      "fetchDashboards"
    ].forEach(property => {
      expect(creators).to.have.property(property);
      delete creators[property];
    });
    expect(creators).to.deep.equal({});
  });
  it("should check the 'fetchDashboards' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const actions = { ...Actions };

    dispatch(actionCreators.fetchDashboards());

    expect(dispatch.getCall(0).returnValue.type).to.eql(
      actions.FETCH_DASHBOARDS
    );
    expect(dispatch.getCall(0).returnValue.api.path).to.eql(
      RECORD_PATH.dashboards
    );
  });
});
