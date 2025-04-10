// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { getUserGroupFilters } from "./utils";

describe("<AgenciesList /> pages/admin/agencies-list/utils", () => {
  it("should return default filters for agencies-list", () => {
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
      },
      {
        field_name: "agency_unique_ids",
        multiple: true,
        name: "cases.filter_by.agency",
        option_strings_source: "Agency",
        option_strings_source_id_key: "unique_id",
        type: "multi_select"
      }
    ];

    expect(getUserGroupFilters(i18n)).toEqual(expected);
  });
});
