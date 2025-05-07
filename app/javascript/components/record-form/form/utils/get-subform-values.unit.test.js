// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getSubformValues from "./get-subform-values";

describe("getSubformValues", () => {
  const index = 1;
  const field = { name: "services_section", subform_section_configuration: {} };
  const values = {
    services_section: [
      {
        response_type: "response-type-2"
      },
      {
        response_type: "response-type-1"
      }
    ]
  };

  describe("when subforms are not sorted", () => {
    it("should return the subform object from formik values", () => {
      const result = getSubformValues(field, index, values);

      expect(result).toEqual({
        response_type: "response-type-1"
      });
    });
  });

  describe("when subforms are sorted", () => {
    it("should return the subform object from orderedValues values and not from formik", () => {
      const orderedValues = [
        {
          response_type: "response-type-1"
        },
        {
          response_type: "response-type-2"
        }
      ];
      const result = getSubformValues(field, index, values, orderedValues);

      expect(result).toEqual({
        response_type: "response-type-2"
      });
    });
  });

  describe("when isViolation", () => {
    it("should return the object with all the associated data to the current violation", () => {
      const indexViolation = 0;
      const fieldViolation = { name: "killing", subform_section_configuration: {} };
      const valuesViolation = {
        killing: [
          {
            killing_number_of_victims: {
              boys: 1,
              girls: 2
            },
            attack_type: "aerial_attack",
            unique_id: "abc123"
          },
          {
            killing_number_of_victims: {
              boys: 2,
              girls: 1
            },
            attack_type: "other",
            unique_id: "123abc"
          }
        ],
        random_value: "testing",
        individual_victims: [
          {
            unique_id: "individual1",
            violations_ids: ["abc123"]
          },
          {
            unique_id: "individual2",
            violations_ids: ["123abc"]
          }
        ],
        perpetrators: [
          {
            unique_id: "perpetrator1",
            violations_ids: ["abc123"]
          }
        ]
      };
      const result = getSubformValues(fieldViolation, indexViolation, valuesViolation, [], true);
      const expected = {
        killing_number_of_victims: {
          boys: 1,
          girls: 2
        },
        attack_type: "aerial_attack",
        unique_id: "abc123",
        individual_victims: [
          {
            unique_id: "individual1",
            violations_ids: ["abc123"]
          }
        ],
        perpetrators: [
          {
            unique_id: "perpetrator1",
            violations_ids: ["abc123"]
          }
        ]
      };

      expect(result).toEqual(expected);
    });
  });
});
