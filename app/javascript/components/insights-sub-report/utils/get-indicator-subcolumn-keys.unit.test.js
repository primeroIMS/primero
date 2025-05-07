// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import getIndicatorSubColumnKeys from "./get-indicator-subcolumn-keys";

describe("getIndicatorSubColumnKeys", () => {
  it("returns the subcolumn keys for the indicator", () => {
    const keys = getIndicatorSubColumnKeys(
      fromJS([
        { id: "row1", column1: 1, total: 1 },
        { id: "row1", column2: 1, total: 1 }
      ])
    );

    expect(keys).toEqual(["column1", "column2"]);
  });

  it("returns the subcolumn keys for the indicator", () => {
    const keys = getIndicatorSubColumnKeys(
      fromJS([
        { group_id: "2020", data: [{ id: "row1", column1: 1, total: 1 }] },
        { group_id: "2021", data: [{ id: "row1", column2: 1, total: 1 }] }
      ])
    );

    expect(keys).toEqual(["column1", "column2"]);
  });
});
