// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getViolationAssociationsValues from "./get-violation-associations-values";

describe("getViolationAssociationsValues", () => {
  it("should return the object with all the associated data to the violation", () => {
    const values = {
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
    const result = getViolationAssociationsValues(values, values.killing[0].unique_id);
    const expected = {
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
