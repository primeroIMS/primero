// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { form } from "./form";

describe("<AgencyForm /> - agencies-form/form", () => {
  const i18n = { t: () => "" };
  const TOTAL_FIELDS_ON_FORM = 13;

  it("returns 11 fields", () => {
    const agencyForm = form(i18n);

    expect(agencyForm.size).toBe(1);
    expect(agencyForm.first().fields).toHaveLength(TOTAL_FIELDS_ON_FORM);
  });
});
