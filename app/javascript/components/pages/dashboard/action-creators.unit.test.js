// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";

import { RECORD_PATH } from "../../../config";
import { DB_COLLECTIONS_NAMES } from "../../../db";

import * as actionCreators from "./action-creators";
import actions from "./actions";
import { DASHBOARD_GROUP, DASHBOARD_NAMES_FOR_GROUP } from "./constants";

describe("<Dashboard /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    ["fetchFlags", "openPageActions", "fetchDashboardApprovals", "fetchDashboards"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("returns the correct object", () => {
    expect(actionCreators.fetchDashboards({ group: DASHBOARD_GROUP.overview }).type).toEqual(
      actions.DASHBOARD_OVERVIEW
    );
    expect(actionCreators.fetchDashboards({ group: DASHBOARD_GROUP.overview }).api.path).toEqual(
      RECORD_PATH.dashboards
    );
    expect(actionCreators.fetchDashboards({ group: DASHBOARD_GROUP.overview }).api.params.names).toEqual(
      DASHBOARD_NAMES_FOR_GROUP.overview
    );
  });

  describe("fetchFlags", () => {
    const commonPath = "record_type=cases&per=10";

    describe("when only activeFlags is false", () => {
      it("returns the correct object", () => {
        const expected = {
          type: "dashboard/DASHBOARD_FLAGS",
          api: {
            path: `flags?${commonPath}`,
            db: {
              collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
              group: DASHBOARD_GROUP.flags
            }
          }
        };

        expect(actionCreators.fetchFlags("cases")).toEqual(expected);
      });
    });
  });

  describe("fetchDashboardApprovals", () => {
    it("returns the correct object", () => {
      const primeroModules = ["primeromodule-test"];

      const expected = {
        type: "dashboard/DASHBOARD_APPROVALS",
        api: {
          path: RECORD_PATH.dashboards,
          params: {
            names: [
              "approvals_action_plan_pending.primeromodule-test",
              "approvals_assessment_pending.primeromodule-test",
              "approvals_case_plan_pending.primeromodule-test",
              "approvals_closure_pending.primeromodule-test",
              "approvals_gbv_closure_pending.primeromodule-test",
              "approvals_action_plan.primeromodule-test",
              "approvals_assessment.primeromodule-test",
              "approvals_case_plan.primeromodule-test",
              "approvals_closure.primeromodule-test",
              "approvals_gbv_closure.primeromodule-test"
            ]
          },
          db: {
            collection: DB_COLLECTIONS_NAMES.DASHBOARDS,
            group: DASHBOARD_GROUP.approvals
          }
        }
      };

      expect(actionCreators.fetchDashboardApprovals(primeroModules)).toEqual(expected);
    });
  });
});
