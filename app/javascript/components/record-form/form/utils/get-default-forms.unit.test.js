// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getDefaultForms from "./get-default-forms";

describe("getDefaultForms", () => {
  const i18n = { t: value => value };

  it("should return the default forms", () => {
    expect(Object.keys(getDefaultForms(i18n)).length).toBe(13);
  });
});
