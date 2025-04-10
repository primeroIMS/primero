// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import partitionObject from "./partition-object";

describe("middleware/utils/partition-object.js", () => {
  const obj = {
    key1: 1,
    Key2: 2,
    Key3: 3,
    key4: 4
  };

  it("is a function with 2 params", () => {
    expect(typeof partitionObject).toBe("function");
  });

  it("handles when filterFn is always false", () => {
    const filterFn = () => false;
    const value = partitionObject(obj, filterFn);

    expect(value).toEqual([{}, obj]);
  });

  it("handles when filterFn is always true", () => {
    const filterFn = () => true;
    const value = partitionObject(obj, filterFn);

    expect(value).toEqual([obj, {}]);
  });

  it("handles when filterFn only test value", () => {
    const filterFn = value => value % 2;
    const value = partitionObject(obj, filterFn);

    expect(value).toEqual([
      {
        key1: 1,
        Key3: 3
      },
      {
        Key2: 2,
        key4: 4
      }
    ]);
  });

  it("handles when filterFn has both (value,key)", () => {
    const filterFn = (value, key) => value % 2 && key[0] === "K";
    const value = partitionObject(obj, filterFn);

    expect(value).toEqual([
      {
        Key3: 3
      },
      {
        key1: 1,
        Key2: 2,
        key4: 4
      }
    ]);
  });
});
