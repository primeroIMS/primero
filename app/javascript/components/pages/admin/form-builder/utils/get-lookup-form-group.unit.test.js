// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getLookupFormGroup from "./get-lookup-form-group";

describe("getLookupFormGroup", () => {
  it("should return the correct LookupFormGroup", () => {
    const formGroupCpCase = {
      id: 1,
      unique_id: "lookup-form-group-cp-case",
      name: {
        en: "Form Groups - CP Case"
      },
      values: [
        {
          id: "group_1",
          disabled: false,
          display_text: {
            en: "Group 1"
          }
        },
        {
          id: "group_2",
          disabled: false,
          display_text: {
            en: "Group 2"
          }
        }
      ]
    };
    const allFormGroupsLookups = [
      formGroupCpCase,
      {
        id: 2,
        unique_id: "lookup-nationality",
        name: {
          en: "Form Groups - CP Case"
        },
        values: [
          {
            id: "nationality_1",
            disabled: false,
            display_text: {
              en: "Nationality 1"
            }
          },
          {
            id: "nationality_2",
            disabled: false,
            display_text: {
              en: "Nationality 2"
            }
          }
        ]
      }
    ];

    expect(getLookupFormGroup(allFormGroupsLookups, "primeromodule-cp", "case")).toBe(formGroupCpCase);
  });

  it("returns empty object if missing parent form and module", () => {
    expect(getLookupFormGroup()).toEqual({});
  });
});
