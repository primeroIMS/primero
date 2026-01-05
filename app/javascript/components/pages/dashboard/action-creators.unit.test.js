// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import clone from "lodash/clone";

import { RECORD_PATH } from "../../../config";
import { DB_COLLECTIONS_NAMES } from "../../../db";

import * as actionCreators from "./action-creators";
import actions from "./actions";
import { DASHBOARD_GROUP, DASHBOARD_GROUPS_WITHOUT_MODULES } from "./constants";

describe("<Dashboard /> - Action Creators", () => {
  it("should have known action creators", () => {
    const creators = clone(actionCreators);

    ["fetchFlags", "openPageActions", "fetchDashboardsByName"].forEach(property => {
      expect(creators).toHaveProperty(property);
      delete creators[property];
    });

    expect(Object.keys(creators)).toHaveLength(0);
  });

  it("returns the correct object", () => {
    const fetchAction = actionCreators.fetchDashboardsByName({
      group: DASHBOARD_GROUP.overview,
      names: DASHBOARD_GROUPS_WITHOUT_MODULES.overview
    });

    expect(fetchAction.type).toEqual(actions.DASHBOARD_OVERVIEW);
    expect(fetchAction.api.path).toEqual(RECORD_PATH.dashboards);
    expect(fetchAction.api.params.names).toEqual(DASHBOARD_GROUPS_WITHOUT_MODULES.overview);
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
});
