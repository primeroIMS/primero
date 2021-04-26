import clone from "lodash/clone";
import sinon from "sinon";
import configureStore from "redux-mock-store";

import { RECORD_PATH } from "../../../config";

import * as actionCreators from "./action-creators";
import actions from "./actions";

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

    expect(creators).to.be.empty;
  });

  it("should check the 'fetchDashboards' action creator to return the correct object", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");

    dispatch(actionCreators.fetchDashboards());

    expect(dispatch.getCall(0).returnValue.type).to.eql(actions.DASHBOARDS);

    expect(dispatch.getCall(0).returnValue.api.path).to.eql(RECORD_PATH.dashboards);
  });

  describe("fetchFlags", () => {
    const store = configureStore()({});
    const dispatch = sinon.spy(store, "dispatch");
    const commonPath = "record_type=cases";

    describe("when only activeFlags is false", () => {
      it("should return the correct object", () => {
        const expected = { type: "dashboard/DASHBOARD_FLAGS", api: { path: `flags?${commonPath}` } };

        dispatch(actionCreators.fetchFlags("cases"));
        const { returnValue: firstCallReturnValue } = dispatch.getCall(0);

        expect(firstCallReturnValue).deep.equals(expected);
      });
    });

    describe("when only activeFlags is true", () => {
      it("should return the correct object", () => {
        const expected = { type: "dashboard/DASHBOARD_FLAGS", api: { path: `flags?active_only=true&${commonPath}` } };

        dispatch(actionCreators.fetchFlags("cases", true));
        const { returnValue: firstCallReturnValue } = dispatch.getCall(1);

        expect(firstCallReturnValue).deep.equals(expected);
      });
    });
  });
});
