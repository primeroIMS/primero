// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<Form /> - components/form/constants", () => {
  it("should have known properties", () => {
    const clone = { ...constants };

    ["NAME", "TEMP_OPTION_ID", "FORM_ID"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
