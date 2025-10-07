// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import buildViolationOptions from "./build-violation-options";

describe("buildViolationOptions", () => {
  it("should return empty array when values is empty", () => {
    const result = buildViolationOptions({}, "", "", false, {}, "");

    expect(result).toEqual([]);
  });

  it("render array of violation options when violation is true", () => {
    const values = {
      enabled: true,
      incident_location: "IQ",
      killing: [
        {
          type: "killing",
          unique_id: "278e90a56763",
          attack_type_other: "new test"
        },
        {
          type: "killing",
          unique_id: "912f8148d102",
          attack_type_other: "new test"
        }
      ]
    };

    const result = buildViolationOptions(values, "killing", "Killing", true, {}, "");
    const expected = [
      {
        id: "278e90a56763",
        display_text: "Killing - 0a56763",
        disabled: false
      },
      {
        id: "912f8148d102",
        display_text: "Killing - 148d102",
        disabled: false
      }
    ];

    expect(result).toEqual(expected);
  });

  it("render array of violation options when violation is true and uniqueId present", () => {
    const values = {
      enabled: true,
      incident_location: "IQ",
      killing: [
        {
          type: "killing",
          unique_id: "278e90a56763",
          attack_type_other: "new test"
        },
        {
          type: "killing",
          unique_id: "912f8148d102",
          attack_type_other: "new test"
        }
      ]
    };

    const result = buildViolationOptions(values, "killing", "Killing", true, {}, "abc123ef");
    const expected = [
      {
        id: "278e90a56763",
        display_text: "Killing - 0a56763",
        disabled: false
      },
      {
        id: "912f8148d102",
        display_text: "Killing - 148d102",
        disabled: false
      },
      {
        id: "abc123ef",
        display_text: "Killing - bc123ef",
        disabled: false
      }
    ];

    expect(result).toEqual(expected);
  });

  it("render array of violation options when violation is false", () => {
    const values = {
      enabled: true,
      incident_location: "IQ",
      killing: [
        {
          type: "killing",
          unique_id: "278e90a56763",
          attack_type_other: "new test"
        }
      ],
      abduction: [
        {
          type: "abduction",
          unique_id: "2f77b4d9",
          abduction_purpose: ["extortion"],
          abduction_crossborder: "false"
        }
      ],
      military_use: [
        {
          type: "military_use",
          unique_id: "dbbf1c97",
          military_use_purpose_other: "violation3"
        }
      ]
    };

    const result = buildViolationOptions(values, "", "", false, { t: v => v }, "");

    const expected = [
      {
        id: "278e90a56763",
        display_text: "incident.violation.types.killing - 0a56763",
        disabled: false
      },
      {
        id: "2f77b4d9",
        display_text: "incident.violation.types.abduction - f77b4d9",
        disabled: false
      },
      {
        id: "dbbf1c97",
        display_text: "incident.violation.types.military_use - bbf1c97",
        disabled: false
      }
    ];

    expect(result).toEqual(expected);
  });
});
