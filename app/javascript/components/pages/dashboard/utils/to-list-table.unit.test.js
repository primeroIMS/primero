import { fromJS } from "immutable";

import toListTable from "./to-list-table";

describe("toListTable - pages/dashboard/utils/", () => {
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
        { name: "new", label: "New" },
        { name: "case_plan", label: "Case Plan" }
      ],
      data: [{ "": "primero", case_plan: 1, new: 3 }],
      query: [
        {
          "": "primero",
          case_plan: ["status=open", "owned_by=primero", "workflow=case_plan"],
          new: ["status=open", "owned_by=primero", "workflow=count"]
        }
      ]
    };

    expect(toListTable(data, labels)).to.deep.equal(expected);
  });
});
