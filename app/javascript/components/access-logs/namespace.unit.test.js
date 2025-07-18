// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as namespace from "./namespace";

describe("ChangeLogs - namespace", () => {
  const namespaceValues = { ...namespace };

  it("should have known properties", () => {
    expect(typeof namespaceValues).toEqual("object");
  });
});
