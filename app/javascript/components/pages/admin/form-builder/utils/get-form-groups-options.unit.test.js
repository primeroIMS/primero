// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getFormGroupsOptions from "./get-form-groups-options";

describe("getFormGroupsOptions", () => {
  it("should return the correct formGroupsOptions", () => {
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
          display_text: "Group 1"
        },
        {
          id: "group_2",
          disabled: false,
          display_text: "Group 2"
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
            display_text: "Nationality 1"
          },
          {
            id: "nationality_2",
            disabled: false,
            display_text: "Nationality 2"
          }
        ]
      }
    ];

    const result = [
      { id: "group_1", display_text: "Group 1" },
      { id: "group_2", display_text: "Group 2" }
    ];

    expect(getFormGroupsOptions(allFormGroupsLookups, "primeromodule-cp", "case", { locale: "en" })).toEqual(result);
  });
});
