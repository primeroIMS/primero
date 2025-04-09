// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import addWithIndex from "./add-with-index";

describe("addWithIndex", () => {
  it("should add an element on an specific index array", () => {
    const original = ["a", "b", "c"];
    const expected = ["a", "b", "d", "c"];

    expect(addWithIndex(original, 2, "d")).toEqual(expected);
  });
});
