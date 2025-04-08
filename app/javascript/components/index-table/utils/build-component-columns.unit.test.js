// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, List } from "immutable";

import buildComponentColumns from "./build-component-columns";

describe("buildComponentColumns", () => {
  it("generates a sorted column with all its options for List", () => {
    const customBodyRender = () => {};

    const columns = buildComponentColumns(
      List([
        { label: "Column 1", name: "column1" },
        { label: "Column 2", name: "column2" },
        { label: "Column 3", name: "column3", options: { customBodyRender } }
      ]),
      "asc",
      "column3"
    );

    expect(columns.map(column => column.name)).toEqual(fromJS(["column1", "column2", "column3"]));
    expect(columns.find(column => column.name === "column3").options).toEqual({
      customBodyRender,
      sortOrder: "asc"
    });
  });

  it("generates a sorted column with all its options for array", () => {
    const customBodyRender = () => {};

    const columns = buildComponentColumns(
      [
        { label: "Column 1", name: "column1" },
        { label: "Column 2", name: "column2" },
        { label: "Column 3", name: "column3", options: { customBodyRender } }
      ],
      "asc",
      "column3"
    );

    expect(columns.map(column => column.name)).toEqual(fromJS(["column1", "column2", "column3"]));
    expect(columns.find(column => column.name === "column3").options).toEqual({
      customBodyRender,
      sortOrder: "asc"
    });
  });
});
