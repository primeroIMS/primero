// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { FieldRecord } from "../../../../../records";

import * as helpers from "./utils";

describe("<ViolationItem /> - utils", () => {
  describe("Verifying utils", () => {
    it("should have known utils", () => {
      const clonedHelpers = { ...helpers };

      ["getViolationTallyLabel"].forEach(property => {
        expect(clonedHelpers).toHaveProperty(property);
        delete clonedHelpers[property];
      });

      expect(clonedHelpers).toEqual({});
    });
  });

  describe("getViolationTallyLabel", () => {
    const fields = [
      FieldRecord({
        name: "relation_name",
        visible: true,
        type: "text_field"
      }),
      FieldRecord({
        name: "relation_child_is_in_contact",
        visible: true,
        type: "text_field"
      }),
      FieldRecord({
        name: "verified",
        visible: true,
        type: "text_field",
        option_strings_source: "lookup lookup-status"
      }),
      FieldRecord({
        name: "violation_tally",
        visible: true,
        type: "tally_field",
        display_name: { en: "violation count", fr: "Nombre de violations" },
        tally: [
          {
            id: "boys",
            display_text: {
              en: "Boys",
              fr: "Garçons"
            }
          },
          {
            id: "girls",
            display_text: {
              en: "Girls",
              fr: "Filles"
            }
          },
          {
            id: "unknown",
            display_text: {
              en: "Unknown",
              fr: "Inconnu"
            }
          }
        ]
      })
    ];
    const currentValues = {
      unique_id: "ab123cde",
      relation_name: "this is a relation",
      violation_tally: { boys: 1, girls: 2, unknow: 0, total: 3 }
    };
    const locale = "en";

    it("should return a short violation values as label", () => {
      expect(helpers.getViolationTallyLabel(fields, currentValues, locale)).toEqual(
        "violation count: Boys: (1) Girls: (2)"
      );
    });

    it("should return the values translated as label", () => {
      expect(helpers.getViolationTallyLabel(fields, currentValues, "fr")).toEqual(
        "Nombre de violations: Garçons: (1) Filles: (2)"
      );
    });

    it("should return null if violation tally is not present", () => {
      expect(helpers.getViolationTallyLabel(fields.slice(0, 3), currentValues, locale)).toBeNull();
    });
  });
});
