// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import handleFilterChange, { valueParser, getFilterProps } from "./value-handlers";

describe("<IndexFilters />/filter-types/value-handlers", () => {
  let methods;
  let filter;

  const i18n = {
    t: value => value
  };
  const user = "josh";

  beforeEach(() => {
    methods = {
      event: jest.fn(),
      setInputValue: jest.fn(),
      setValue: jest.fn(),
      fieldName: "field-name"
    };
  });

  describe("handleFilterChange()", () => {
    it("handles basic inputs", () => {
      methods.value = 2;

      handleFilterChange(methods);

      expect(methods.setInputValue).toHaveBeenCalledWith(2);
      expect(methods.setValue).toHaveBeenCalledWith(methods.fieldName, 2);
    });

    it("handles checkboxes with array value", () => {
      methods.inputValue = [1];
      methods.type = "checkboxes";
      methods.event = { target: { checked: true, value: 2 } };

      handleFilterChange(methods);

      expect(methods.setInputValue).toHaveBeenCalledWith([1, 2]);
      expect(methods.setValue).toHaveBeenCalledWith(methods.fieldName, [1, 2]);
    });

    it("handles checkboxes with object value", () => {
      const expectedValue = { field_1: "field_1", field_2: "field_2" };

      methods.inputValue = { field_1: "field_1" };
      methods.type = "objectCheckboxes";
      methods.event = { target: { checked: true, value: "field_2=field_2" } };

      handleFilterChange(methods);

      expect(methods.setInputValue).toHaveBeenCalledWith(expectedValue);
      expect(methods.setValue).toHaveBeenCalledWith(methods.fieldName, expectedValue);
    });
  });

  describe("valueParser()", () => {
    it("returns parsed age value", () => {
      const value = "1 - 10";
      const output = valueParser("age", value);

      expect(output).toBe("1..10");
    });

    it("returns passed value by default", () => {
      const value = "test-value";
      const output = valueParser(methods.fieldName, value);

      expect(output).toBe(value);
    });
  });

  describe("getFilterProps()", () => {
    const { getTimezoneOffset } = Date.prototype;

    beforeEach(() => {
      // eslint-disable-next-line no-extend-native
      Date.prototype.getTimezoneOffset = () => 240;

      const today = new Date("2020-10-01T00:00:00Z");

      jest.useFakeTimers().setSystemTime(today);

      filter = {
        field_name: "field-name",
        isObject: false,
        option_strings_source: "lookup-options-1",
        options: [{ id: "option-1", display_text: "Option 1" }]
      };
    });

    it("returns default properties from filter object", () => {
      const expected = {
        fieldName: "field-name",
        isObject: false,
        optionStringsSource: "lookup-options-1",
        options: [{ id: "option-1", display_text: "Option 1" }]
      };
      const output = getFilterProps({ filter, user, i18n });

      expect(output).toEqual(expected);
    });

    it("returns properties for my_cases filter from filter object", () => {
      filter.field_name = "my_cases";

      const expected = {
        options: [
          {
            id: "owned_by=josh",
            key: "owned_by",
            display_name: "cases.filter_by.referred_cases"
          },
          {
            id: "assigned_user_names=josh",
            key: "assigned_user_names",
            display_name: "cases.filter_by.referred_cases"
          }
        ],
        isObject: true,
        fieldName: "or"
      };

      const label = jest.fn().mockReturnValue("cases.filter_by.referred_cases");

      const output = getFilterProps({ filter, user, i18n, label });

      expect(output).toEqual(expected);
    });

    it("returns properties for last_updated_at filter from filter object", () => {
      filter.field_name = "last_updated_at";

      const expected = {
        fieldName: "last_updated_at",
        options: [
          {
            display_name: "cases.filter_by.3month_inactivity",
            id: "0000-01-01T00:00:00Z..2020-07-01T23:59:59Z"
          }
        ]
      };
      const output = getFilterProps({ filter, user, i18n });

      expect(output).toEqual(expected);
    });

    afterEach(() => {
      // Restore original method
      // eslint-disable-next-line no-extend-native
      Date.prototype.getTimezoneOffset = getTimezoneOffset;

      jest.useRealTimers();
      jest.resetAllMocks();
    });
  });
});
