import { expect } from "../../../../test";

import { getFilters } from "./helpers";

describe("<AgenciesList /> pages/admin/agencies-list/helpers", () => {
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
      }
    ];

    expect(getFilters(i18n)).to.be.deep.equals(expected);
  });
});
