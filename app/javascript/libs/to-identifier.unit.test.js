// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import toIdentifier from "./to-identifier";
import uuid from "./uuid";

describe("toIdentifier", () => {
  const identifier = "1234abc";

  beforeEach(() => {
    jest.spyOn(uuid, "v4").mockReturnValue("1234abc");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return the id with identifier if id is not a falsy value", () => {
    const id = "efg";
    const expected = `${id}_${identifier}`;

    expect(toIdentifier(id)).toBe(expected);
  });

  it("should only return the identifier if id is a falsy value", () => {
    expect(toIdentifier()).toBe(identifier);
  });
});
