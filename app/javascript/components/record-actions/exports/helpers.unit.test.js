import { fromJS } from "immutable";

import { expect } from "../../../test";
import { ACTIONS } from "../../../libs/permissions";

import { ALL_EXPORT_TYPES, EXPORT_FORMAT } from "./constants";
import * as helper from "./helpers";

describe("<RecordActions /> - exports/helpers", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...helper };

      ["allowedExports", "formatFileName"].forEach(property => {
        expect(clone).to.have.property(property);
        expect(clone[property]).to.be.a("function");
        delete clone[property];
      });
      expect(clone).to.be.empty;
    });
  });

  describe("allowedExports", () => {
    it("should return all export types if userPermission contains manage permission", () => {
      const userPermission = fromJS(["manage"]);

      expect(helper.allowedExports(userPermission)).to.deep.equal(
        ALL_EXPORT_TYPES
      );
    });

    it("should return export types contained in userPermission", () => {
      const expected = [
        {
          id: "csv",
          display_name: "CSV",
          permission: ACTIONS.EXPORT_CSV,
          format: EXPORT_FORMAT.CSV
        },
        {
          id: "json",
          display_name: "JSON",
          permission: ACTIONS.EXPORT_JSON,
          format: EXPORT_FORMAT.JSON
        }
      ];

      const userPermission = fromJS([ACTIONS.EXPORT_CSV, ACTIONS.EXPORT_JSON]);

      expect(helper.allowedExports(userPermission)).to.deep.equal(expected);
    });
  });

  describe("formatFileName", () => {
    it("should set to default filename if any filename was not specified", () => {
      expect(helper.formatFileName("", "csv")).to.be.empty;
    });

    it("should not return labels if there are not translations", () => {
      const expected = "hello-world.csv";

      expect(helper.formatFileName("hello world", "csv")).to.be.equal(expected);
    });
  });
});
