import { fromJS } from "immutable";

import { expect } from "../test";

import { dataToJS, valuesToSearchableSelect, compare } from "./component-helpers";

describe("component-helpers", () => {
  describe("dataToJS", () => {
    it("should convert data to plain JS from Map", () => {
      const expected = { a: "test" };
      const immutableMap = fromJS(expected);

      expect(dataToJS(immutableMap)).to.deep.equal(expected);
    });

    it("should convert data to plain JS from List", () => {
      const expected = ["a", "b", "c"];
      const immbutableList = fromJS(expected);

      expect(dataToJS(immbutableList)).to.deep.equal(expected);
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

      expect(
        valuesToSearchableSelect(data, "id", "userName", "en")
      ).to.deep.equal(expected);
    });

    it("should convert values to searchableSelect value with locale es", () => {
      const expected = [
        { value: "user-1", label: "Usuario 1" },
        { value: "user-2", label: "Usuario 2" }
      ];

      expect(
        valuesToSearchableSelect(data, "id", "userName", "es")
      ).to.deep.equal(expected);
    });
  });

  describe("compare", () => {
    it("should return true if two objects are equal", () => {
      const obj1 = fromJS({ name: "User Name" });
      const obj2 = fromJS({ name: "User Name" });

      expect(compare(obj1, obj2)).to.equal(true);
    });

    it("should return false if two objects are not equal", () => {
      const obj1 = fromJS({ name: "User Name 1" });
      const obj2 = fromJS({ name: "User Name 2" });

      expect(compare(obj1, obj2)).to.equal(false);
    });
  });
});
