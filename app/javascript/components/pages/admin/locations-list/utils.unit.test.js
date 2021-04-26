import { fromJS } from "immutable";

import { getFilters, getColumns } from "./utils";
import { COLUMNS } from "./constants";

describe("<LocationsList /> pages/admin/location-list/utils", () => {
  describe("getFilters", () => {
    it("should return default filters for location-list", () => {
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

  describe("getColumns", () => {
    const columns = [
      { name: COLUMNS.NAME, label: "Name" },
      { name: COLUMNS.TYPE, label: "Type" },
      { name: COLUMNS.HIERARCHY, label: "Hierarchy" }
    ];

    const lookup = [
      {
        id: "test_1",
        display_text: "Test 1"
      },
      {
        id: "test_2",
        display_text: "Test 2"
      }
    ];

    describe("when column name is name", () => {
      it("should split name and return last value", () => {
        const expected = "TEST NAME";
        const nameColumn = getColumns(columns, fromJS([])).find(column => column.name === COLUMNS.NAME);

        expect(nameColumn.options.customBodyRender("TEST_1::TEST_2::TEST NAME")).to.be.equals(expected);
      });
    });

    describe("when column name is type", () => {
      it("should return the translated value from the lookup-location-type lookup", () => {
        const expected = "Test 2";
        const typeColumn = getColumns(columns, lookup).find(column => column.name === COLUMNS.TYPE);

        expect(typeColumn.options.customBodyRender("test_2")).to.be.equals(expected);
      });
    });

    describe("when there is a column different than name or type", () => {
      it("should not have options(customBodyRender)", () => {
        const hierarchyColumn = getColumns(columns, lookup).find(column => column.name === COLUMNS.HIERARCHY);

        expect(hierarchyColumn.options).to.be.empty;
      });
    });
  });
});
