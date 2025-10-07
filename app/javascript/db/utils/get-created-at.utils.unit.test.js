// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { isEqual, parseISO } from "date-fns";

import getCreatedAt from "./get-created-at";

describe("getCreatedAt", () => {
  it("should return the same date if created_at is a date", () => {
    const createdAt = new Date();
    const record = { created_at: createdAt };

    expect(isEqual(getCreatedAt(record), createdAt)).toBe(true);
  });

  it("should parse the date if created_at is a string", () => {
    const createdAt = "2020-05-01";
    const record = { created_at: createdAt };

    expect(isEqual(getCreatedAt(record), parseISO(createdAt))).toBe(true);
  });
});
