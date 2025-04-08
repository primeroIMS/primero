// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as constants from "./constants";

describe("<CreateRecordDialog /> - constants", () => {
  const clone = { ...constants };

  it("should have known properties", () => {
    expect(typeof clone).toEqual("object");
    ["NAME", "PHONETIC_FIELD_NAME", "FORM_ID"].forEach(property => {
      expect(clone).toHaveProperty(property);
      delete clone[property];
    });

    expect(Object.keys(clone)).toHaveLength(0);
  });
});
