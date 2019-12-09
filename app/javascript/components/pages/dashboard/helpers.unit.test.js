import { fromJS } from "immutable";

import { expect } from "../../../test";

import { toData1D } from "./helpers";

describe("<Dashboard /> - Helpers", () => {
  describe("toData1D", () => {
    it("should convert data to plain JS", () => {
      const expected = {
        labels: ["New", "Service provision", "Care plan"],
        data: [10, 15, 8],
        query: [
          ["workflow=new"],
          ["workflow=service_provision"],
          ["workflow=care_plan"]
        ]
      };

      const casesWorkflow = fromJS({
        name: "dashboard.workflow",
        type: "indicator",
        stats: {
          new: {
            count: 10,
            query: ["workflow=new"]
          },
          service_provision: {
            count: 15,
            query: ["workflow=service_provision"]
          },
          care_plan: {
            count: 8,
            query: ["workflow=care_plan"]
          }
        }
      });

      const workflowLabels = [
        { id: "new", display_text: "New" },
        { id: "reopened", display_text: "Reopened" },
        { id: "case_plan", display_text: "Case Plan" },
        { id: "care_plan", display_text: "Care plan" },
        { id: "action_plan", display_text: "Action plan" },
        { id: "service_provision", display_text: "Service provision" },
        { id: "services_implemented", display_text: "Service Implemented" },
        { id: "closed", display_text: "Closed" }
      ];

      expect(toData1D(casesWorkflow, workflowLabels)).to.deep.equal(expected);
    });
  });
});
