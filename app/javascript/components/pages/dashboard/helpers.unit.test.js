import { fromJS } from "immutable";

import { expect } from "../../../test";

import * as helper from "./helpers";

describe("<Dashboard /> - Helpers", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...helper };

      ["toData1D", "toListTable", "toReportingLocationTable"].forEach(
        property => {
          expect(clone).to.have.property(property);
          expect(clone[property]).to.be.a("function");
          delete clone[property];
        }
      );
      expect(clone).to.be.empty;
    });
  });

  describe("toData1D", () => {
    const casesWorkflow = fromJS({
      name: "dashboard.workflow",
      type: "indicator",
      indicators: {
        workflow: {
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
      }
    });

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

      expect(helper.toData1D(casesWorkflow, workflowLabels)).to.deep.equal(
        expected
      );
    });

    it("should not return labels if there are not translations", () => {
      const { labels } = helper.toData1D(casesWorkflow, []);

      expect(labels).to.be.empty;
    });
  });

  describe("toListTable", () => {
    it("should convert data to plain JS", () => {
      const data = fromJS({
        name: "dashboard.workflow_team",
        type: "indicator",
        indicators: {
          workflow_team: {
            "": {
              "": {
                count: 0,
                query: ["status=open", "owned_by=", "workflow="]
              },
              case_plan: {
                count: 0,
                query: ["status=open", "owned_by=", "workflow="]
              },
              new: {
                count: 0,
                query: ["status=open", "owned_by=", "workflow="]
              }
            },
            primero: {
              "": {
                count: 0,
                query: ["status=open", "owned_by=primero", "workflow="]
              },
              case_plan: {
                count: 1,
                query: ["status=open", "owned_by=primero", "workflow=case_plan"]
              },
              new: {
                count: 3,
                query: ["status=open", "owned_by=primero", "workflow=count"]
              }
            }
          }
        }
      });

      const labels = [
        { id: "new", display_text: "New" },
        { id: "reopened", display_text: "Reopened" },
        { id: "case_plan", display_text: "Case Plan" }
      ];

      const expected = {
        columns: [
          { name: "", label: "" },
          { name: "case_plan", label: "Case Plan" },
          { name: "new", label: "New" }
        ],
        data: [{ "": "primero", case_plan: 1, new: 3 }],
        query: [
          {
            "": "primero",
            case_plan: [
              "status=open",
              "owned_by=primero",
              "workflow=case_plan"
            ],
            new: ["status=open", "owned_by=primero", "workflow=count"]
          }
        ]
      };

      expect(helper.toListTable(data, labels)).to.deep.equal(expected);
    });
  });

  describe("toReportingLocationTable", () => {
    it("should convert the data for the table", () => {
      const locations = fromJS([
        {
          id: 1,
          code: "1506060",
          type: "sub_district",
          name: { en: "My District" }
        }
      ]);

      const data = fromJS({
        name: "dashboard.reporting_location",
        type: "indicator",
        indicators: {
          reporting_location_open: {
            "1506060": {
              count: 1,
              query: [
                "record_state=true",
                "status=open",
                "owned_by_location2=1506060"
              ]
            }
          },
          reporting_location_open_last_week: {
            "1506060": {
              count: 0,
              query: [
                "record_state=true",
                "status=open",
                "created_at=2019-12-25T00:00:00Z..2019-12-31T23:59:59Z",
                "owned_by_location2=1506060"
              ]
            }
          },
          reporting_location_open_this_week: {
            "1506060": {
              count: 1,
              query: [
                "record_state=true",
                "status=open",
                "created_at=2020-01-01T00:00:00Z..2020-01-08T19:32:20Z",
                "owned_by_location2=1506060"
              ]
            }
          },
          reporting_location_closed_last_week: {
            "1506060": {
              count: 0,
              query: [
                "record_state=true",
                "status=closed",
                "created_at=2019-12-25T00:00:00Z..2019-12-31T23:59:59Z",
                "owned_by_location2=1506060"
              ]
            }
          },
          reporting_location_closed_this_week: {
            "1506060": {
              count: 0,
              query: [
                "record_state=true",
                "status=closed",
                "created_at=2020-01-01T00:00:00Z..2020-01-08T19:32:20Z",
                "owned_by_location2=1506060"
              ]
            }
          }
        }
      });

      const expected = [["My District", 1, 0, 1, 0, 0]];

      const i18nMock = { t: () => ({}), locale: "en" };

      const converted = helper.toReportingLocationTable(
        data,
        "district",
        i18nMock,
        locations
      ).data;

      expect(converted).to.deep.equal(expected);
    });
  });
});
