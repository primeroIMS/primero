// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import toFacetedTable from "./to-faceted-table";

describe("toFacetedTable - pages/dashboard/utils/", () => {
  it("returns the table props for a faceted indicator", () => {
    const data = fromJS({
      indicators: {
        facetedIndicator: {
          value1: { count: 1, query: ["facetedIndicator=value1"] },
          value2: { count: 2, query: ["facetedIndicator=value2"] }
        }
      }
    });

    expect(toFacetedTable(data, "Total", [], "facetedIndicator")).toEqual({
      columns: [
        { label: "", name: "" },
        { label: "Total", name: "total" }
      ],
      data: [
        { "": "value1", total: 1 },
        { "": "value2", total: 2 }
      ],
      query: [
        { "": "value1", total: ["facetedIndicator=value1"] },
        { "": "value2", total: ["facetedIndicator=value2"] }
      ]
    });
  });

  it("returns the table props using the lookup order", () => {
    const data = fromJS({
      indicators: {
        facetedIndicator: {
          value1: { count: 1, query: ["facetedIndicator=value1"] },
          value2: { count: 2, query: ["facetedIndicator=value2"] }
        }
      }
    });

    const lookup = [
      { id: "value2", display_text: "Value 2" },
      { id: "value1", display_text: "Value 1" }
    ];

    expect(toFacetedTable(data, "Total", lookup, "facetedIndicator")).toEqual({
      columns: [
        { label: "", name: "" },
        { label: "Total", name: "total" }
      ],
      data: [
        { "": "Value 2", total: 2 },
        { "": "Value 1", total: 1 }
      ],
      query: [
        { "": "Value 2", total: ["facetedIndicator=value2"] },
        { "": "Value 1", total: ["facetedIndicator=value1"] }
      ]
    });
  });

  it("returns an empty table if there is no data for the indicator", () => {
    const data = fromJS({
      indicators: { facetedIndicator: null }
    });

    const lookup = [
      { id: "value2", display_text: "Value 2" },
      { id: "value1", display_text: "Value 1" }
    ];

    expect(toFacetedTable(data, "Total", lookup, "facetedIndicator")).toEqual({
      columns: [],
      data: [],
      query: []
    });
  });
});
