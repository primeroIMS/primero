// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { parseISO } from "date-fns";

import {
  compare,
  dataToJS,
  normalizeTimezone,
  toServerDateFormat,
  valuesToSearchableSelect,
  getObjectPath
} from "./component-helpers";

describe("component-helpers", () => {
  describe("dataToJS", () => {
    it("should convert data to plain JS from Map", () => {
      const expected = { a: "test" };
      const immutableMap = fromJS(expected);

      expect(dataToJS(immutableMap)).toEqual(expected);
    });

    it("should convert data to plain JS from List", () => {
      const expected = ["a", "b", "c"];
      const immbutableList = fromJS(expected);

      expect(dataToJS(immbutableList)).toEqual(expected);
    });
  });

  describe("valuesToSearchableSelect", () => {
    const data = fromJS([
      { id: "user-1", userName: { en: "User 1", es: "Usuario 1" } },
      { id: "user-2", userName: { en: "User 2", es: "Usuario 2" } }
    ]);

    it("should convert values to searchableSelect value with locale en", () => {
      const expected = [
        { value: "user-1", label: "User 1" },
        { value: "user-2", label: "User 2" }
      ];

      expect(valuesToSearchableSelect(data, "id", "userName", "en")).toEqual(expected);
    });

    it("should convert values to searchableSelect value with locale es", () => {
      const expected = [
        { value: "user-1", label: "Usuario 1" },
        { value: "user-2", label: "Usuario 2" }
      ];

      expect(valuesToSearchableSelect(data, "id", "userName", "es")).toEqual(expected);
    });
  });

  describe("compare", () => {
    it("should return true if two objects are equal", () => {
      const obj1 = fromJS({ name: "User Name" });
      const obj2 = fromJS({ name: "User Name" });

      expect(compare(obj1, obj2)).toBe(true);
    });

    it("should return false if two objects are not equal", () => {
      const obj1 = fromJS({ name: "User Name 1" });
      const obj2 = fromJS({ name: "User Name 2" });

      expect(compare(obj1, obj2)).toBe(false);
    });
  });

  // Based on https://github.com/react-hook-form/react-hook-form/blob/v4.4.8/src/utils/getPath.test.ts
  describe("getPath", () => {
    it("should generate the correct path", () => {
      expect(
        getObjectPath("test", [
          1,
          [1, 2],
          {
            data: "test",
            kidding: { test: "data" },
            foo: { bar: {} },
            what: [{ bill: { haha: "test" } }, [3, 4]],
            one: 1,
            empty: null,
            absent: undefined,
            isAwesome: true,
            answer: Symbol(42)
          }
        ])
      ).toEqual([
        "test[0]",
        "test[1][0]",
        "test[1][1]",
        "test[2].data",
        "test[2].kidding.test",
        "test[2].what[0].bill.haha",
        "test[2].what[1][0]",
        "test[2].what[1][1]",
        "test[2].one",
        "test[2].empty",
        "test[2].absent",
        "test[2].isAwesome",
        "test[2].answer"
      ]);
    });
  });

  describe("normalizeTimezone", () => {
    const { getTimezoneOffset } = Date.prototype;

    beforeEach(() => {
      const today = parseISO("2010-01-05T18:30:00Z");

      // Use a -04:00 timezone
      // eslint-disable-next-line no-extend-native
      Date.prototype.getTimezoneOffset = () => 240;

      jest.useFakeTimers().setSystemTime(today);
    });

    it("should remove the timezone from the date", () => {
      const date = parseISO("2010-01-05T14:30:00Z");
      const expectedDate = parseISO("2010-01-05T18:30:00Z");

      expect(normalizeTimezone(date).toString()).toBe(expectedDate.toString());
    });

    afterEach(() => {
      // Restore original method
      // eslint-disable-next-line no-extend-native
      Date.prototype.getTimezoneOffset = getTimezoneOffset;
      jest.resetAllMocks();
      jest.useRealTimers();
    });
  });

  describe("toServerDateFormat", () => {
    beforeEach(() => {
      const today = parseISO("2010-01-05T18:30:00Z");

      jest.useFakeTimers().setSystemTime(today);
    });

    it("should return the API_DATE_FORMAT if the date does not include time", () => {
      const date = parseISO("2010-01-05T14:30:00Z");

      expect(toServerDateFormat(date)).toBe("2010-01-05");
    });

    it("should return the API_DATE_TIME_FORMAT if the date does include time", () => {
      const date = parseISO("2010-01-05T14:30:00Z");

      expect(toServerDateFormat(date, { includeTime: true })).toBe("2010-01-05T14:30:00Z");
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.useRealTimers();
    });
  });
});
