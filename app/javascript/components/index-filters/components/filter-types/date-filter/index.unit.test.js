// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import index from "./index";

describe("<IndexFilters /> - filter-types/date-filter/index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
  });
});
