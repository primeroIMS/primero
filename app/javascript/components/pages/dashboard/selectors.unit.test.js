import { expect } from "chai";
import { fromJS } from "immutable";

import { DASHBOARD } from "../../../config";

import * as selectors from "./selectors";

const initialState = fromJS({
  records: {
    dashboard: {
      data: [
        {
          name: "dashboard.case_risk",
          type: "indicator",
          stats: {
            high: {
              count: 2,
              query: ["record_state=true", "status=open", "risk_level=high"]
            },
            medium: {
              count: 1,
              query: ["record_state=true", "status=open", "risk_level=medium"]
            },
            none: {
              count: 0,
              query: ["record_state=true", "status=open", "risk_level=none"]
            }
          }
        }
      ]
    }
  }
});

describe("<Dashboard /> - Selectors", () => {
  describe("getCasesByAssessmentLevel", () => {
    it("should return a list of dashboard", () => {
      const records = selectors.getCasesByAssessmentLevel(initialState);

      const expected = fromJS({
        name: DASHBOARD.case_risk,
        type: "indicator",
        stats: {
          high: {
            count: 2,
            query: ["record_state=true", "status=open", "risk_level=high"]
          },
          medium: {
            count: 1,
            query: ["record_state=true", "status=open", "risk_level=medium"]
          },
          none: {
            count: 0,
            query: ["record_state=true", "status=open", "risk_level=none"]
          }
        }
      });

      expect(records).to.deep.equal(expected);
    });
  });
});
