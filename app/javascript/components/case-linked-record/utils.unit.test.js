// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/sort-prop-types */

import { buildSearchParams, buildValidation } from "./utils";

describe("case-linked-record/utils.js", () => {
  describe("buildValidation", () => {
    const fields = [
      {
        option_strings_text: [
          { id: "option1", display_text: "Option 1" },
          { id: "option2", display_text: "Option 2" }
        ]
      }
    ];

    it("should return form validation object (validation passes)", async () => {
      const validations = await buildValidation(fields).isValid({ search_by: "option1", option1: "test" });

      expect(validations).toBe(true);
    });

    it("should return form validation object (validation fails)", async () => {
      const validations = await buildValidation(fields).isValid({});

      expect(validations).toBe(false);
    });
  });

  describe("buildSearchParams", () => {
    it("should return the search params", () => {
      const searchParams = buildSearchParams({ code: "001" }, []);

      expect(searchParams).toEqual({ code: "001" });
    });

    it("should return the search params for a phonetic field", () => {
      const searchParams = buildSearchParams({ name: "SomeName" }, ["name"]);

      expect(searchParams).toEqual({ query: "SomeName", phonetic: true });
    });
  });
});
