// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import * as selectors from "./selectors";

const initialState = fromJS({
  ui: {
    Nav: {
      drawerOpen: true,
      alerts: {
        data: {
          case: 2,
          incident: 0,
          tracing_request: 1
        }
      }
    }
  }
});

describe("<Nav /> - Selectors", () => {
  describe("selectAlerts", () => {
    it("should return a list of selectAlerts", () => {
      const records = selectors.selectAlerts(initialState);

      const expected = fromJS({
        case: 2,
        incident: 0,
        tracing_request: 1
      });

      expect(records).toEqual(expected);
    });
  });
});
