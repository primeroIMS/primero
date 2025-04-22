// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./index";

describe("<Form /> - index", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
    ["RecordForm", "RecordFormToolbar", "FormSectionField"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });
    expect(Object.keys(clone)).toHaveLength(0);
  });
});
