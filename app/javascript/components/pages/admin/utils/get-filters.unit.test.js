// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getFilters from "./get-filters";

describe("pages/admin/utils/getFilters", () => {
  it("should return default filters", () => {
    const i18n = { t: value => value, locale: "en" };
    const expected = [
      {
        field_name: "disabled",
        name: "cases.filter_by.enabled_disabled",
        option_strings_source: null,
        options: {
          en: [
            {
              display_name: "disabled.status.enabled",
              id: "false"
            },
            {
              display_name: "disabled.status.disabled",
              id: "true"
            }
          ]
        },
        type: "multi_toggle"
      }
    ];

    expect(getFilters(i18n)).toEqual(expected);
  });
});
