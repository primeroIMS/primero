// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import first from "lodash/first";

import sortByAge from "./sort-by-age";

describe("report/utils/sort-by-age.js", () => {
  it("returns ordered array for an array of strings", () => {
    const data = ["8", "5", "10"];
    const expected = ["5", "8", "10"];

    expect(sortByAge(data)).toEqual(expected);
  });

  it("returns ordered array for an array of strings", () => {
    const data = ["Incomplete Data", "8", "5", "10"];
    const expected = ["5", "8", "10", "Incomplete Data"];

    expect(sortByAge(data)).toEqual(expected);
  });

  it("returns ordered array for an array of arrays", () => {
    const data = [
      ["Incomplete Data", { Total: 1 }],
      ["8", { Total: 8 }],
      ["10", { Total: 10 }],
      ["5", { Total: 5 }]
    ];
    const expected = [
      ["5", { Total: 5 }],
      ["8", { Total: 8 }],
      ["10", { Total: 10 }],
      ["Incomplete Data", { Total: 1 }]
    ];

    expect(sortByAge(data, elem => first(elem))).toEqual(expected);
  });
});
