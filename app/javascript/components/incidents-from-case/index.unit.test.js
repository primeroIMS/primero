// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import index from "./index";

describe("<IncidentFromCase /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(typeof indexValues).toEqual("object");
  });
});
