// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import toListTable from "./to-list-table";
import defaultBodyRender from "./default-body-render";

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
      { id: "new", display_text: { en: "New" } },
      { id: "reopened", display_text: { en: "Reopened" } },
      { id: "case_plan", display_text: { en: "Case Plan" } }
    ];

    const options = { customBodyRender: defaultBodyRender };

    const expected = {
      columns: [
        { name: "", label: "", options },
        { name: "new", label: "New", options },
        { name: "case_plan", label: "Case Plan", options }
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

    expect(toListTable(data, labels, null, "en")).toEqual(expected);
  });

  it("should return an empty config if there is no data for an indicator", () => {
    const data = fromJS({
      name: "dashboard.workflow_team",
      type: "indicator",
      indicators: { workflow_team: {} }
    });

    const labels = [
      { id: "new", display_text: { en: "New" } },
      { id: "reopened", display_text: { en: "Reopened" } },
      { id: "case_plan", display_text: { en: "Case Plan" } }
    ];

    const expected = {
      columns: [
        {
          label: "",
          name: "",
          options: { customBodyRender: defaultBodyRender }
        }
      ],
      data: [],
      query: []
    };

    expect(toListTable(data, labels, null, "en")).toEqual(expected);
  });

  it("should follow the labels order for the data", () => {
    const data = fromJS({
      name: "dashboard.workflow_category",
      type: "indicator",
      indicators: {
        workflow_category: {
          "": {
            "": {
              count: 0,
              query: ["status=open", "category=", "workflow="]
            },
            case_plan: {
              count: 0,
              query: ["status=open", "category=", "workflow="]
            },
            new: {
              count: 0,
              query: ["status=open", "category=", "workflow="]
            }
          },
          category_1: {
            "": {
              count: 0,
              query: ["status=open", "category=category_1", "workflow="]
            },
            case_plan: {
              count: 2,
              query: ["status=open", "category=category_1", "workflow=case_plan"]
            },
            new: {
              count: 3,
              query: ["status=open", "category=category_1", "workflow=new"]
            }
          },
          category_2: {
            "": {
              count: 0,
              query: ["status=open", "category=category_2", "workflow="]
            },
            case_plan: {
              count: 1,
              query: ["status=open", "category=category_2", "workflow=case_plan"]
            },
            new: {
              count: 3,
              query: ["status=open", "category=category_2", "workflow=new"]
            }
          }
        }
      }
    });

    const columnLabels = [
      { id: "new", display_text: "New" },
      { id: "reopened", display_text: "Reopened" },
      { id: "case_plan", display_text: "Case Plan" }
    ];

    const rowLabels = [
      { id: "category_2", display_text: "Category 2" },
      { id: "category_1", display_text: "Category 1" }
    ];

    const options = { customBodyRender: defaultBodyRender };

    const expected = {
      columns: [
        { name: "", label: "", options },
        { name: "new", label: "New", options },
        { name: "case_plan", label: "Case Plan", options }
      ],
      data: [
        { "": "Category 2", case_plan: 1, new: 3 },
        { "": "Category 1", case_plan: 2, new: 3 }
      ],
      query: [
        {
          "": "Category 2",
          case_plan: ["status=open", "category=category_2", "workflow=case_plan"],
          new: ["status=open", "category=category_2", "workflow=new"]
        },
        {
          "": "Category 1",
          case_plan: ["status=open", "category=category_1", "workflow=case_plan"],
          new: ["status=open", "category=category_1", "workflow=new"]
        }
      ]
    };

    expect(toListTable(data, columnLabels, rowLabels, "en")).toEqual(expected);
  });
});
