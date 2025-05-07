// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { DATE_FIELD } from "../../../form";
import { CONSTRAINTS, NOT_NULL } from "../../constants";

import * as utils from "./utils";

describe("ReportFiltersList - utils", () => {
  describe("getConstraintLabel()", () => {
    const i18n = { t: value => value };

    it("should return not_blank when constraint is a boolean and it's true", () => {
      const data = { value: ["true"], constraint: true };

      expect(utils.getConstraintLabel(data, {}, CONSTRAINTS, i18n)).toBe("report.filters.not_blank");
    });

    it("should return not_blank when value is an array an contains not_null value", () => {
      const data = {
        value: [NOT_NULL],
        constraint: false,
        attribute: "test"
      };

      expect(utils.getConstraintLabel(data, {}, CONSTRAINTS, i18n)).toBe("report.filters.not_blank");
    });

    it("should return a valid constraint if value is not an array", () => {
      const data = {
        value: "15",
        constraint: "=",
        attribute: "test"
      };

      expect(utils.getConstraintLabel(data, {}, CONSTRAINTS, i18n)).toBe("report.filters.equal_to");
    });

    describe("when the field is DATE_FIELD type", () => {
      const field = { type: DATE_FIELD };
      const data = {
        value: "01-Jan-2001",
        constraint: ">",
        attribute: "date_test"
      };

      it("should return after if the constraint is >", () => {
        expect(utils.getConstraintLabel(data, field, CONSTRAINTS, i18n)).toBe("report.filters.after");
      });
      it("should return before if the constraint is <", () => {
        expect(utils.getConstraintLabel({ ...data, constraint: "<" }, field, CONSTRAINTS, i18n)).toBe(
          "report.filters.before"
        );
      });
    });
  });
});
