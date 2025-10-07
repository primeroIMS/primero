// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import calculateFilters from "./calculate-filters";

describe("<IndexFilters>/utils - calculateFilters", () => {
  it("returns an array of filters", () => {
    const expected = fromJS([
      {
        name: "cases.filter_by.risk_level",
        field_name: "risk_level",
        option_strings_source: "lookup-risk-level",
        options: [],
        type: "chips"
      },
      {
        name: "cases.filter_by.no_activity",
        field_name: "last_updated_at",
        option_strings_source: null,
        options: [],
        type: "checkbox"
      },
      {
        name: "cases.filter_by.protection_concerns",
        field_name: "protection_concerns",
        option_strings_source: "lookup-protection-concerns",
        options: [],
        type: "checkbox"
      },
      {
        name: "cases.filter_by.enabled_disabled",
        field_name: "record_state",
        option_strings_source: null,
        options: {
          en: [
            {
              id: "true",
              display_name: "Enabled"
            },
            {
              id: "false",
              display_name: "Disabled"
            }
          ]
        }
      },
      {
        name: "cases.filter_by.sex",
        field_name: "sex",
        option_strings_source: "lookup-gender",
        options: [],
        type: "checkbox"
      }
    ]);

    const params = {
      defaultFilters: [
        {
          name: "cases.filter_by.protection_concerns",
          field_name: "protection_concerns",
          option_strings_source: "lookup-protection-concerns",
          options: [],
          type: "checkbox"
        },
        {
          name: "cases.filter_by.enabled_disabled",
          field_name: "record_state",
          option_strings_source: null,
          options: {
            en: [
              {
                id: "true",
                display_name: "Enabled"
              },
              {
                id: "false",
                display_name: "Disabled"
              }
            ]
          }
        },
        {
          name: "cases.filter_by.sex",
          field_name: "sex",
          option_strings_source: "lookup-gender",
          options: [],
          type: "checkbox"
        }
      ],
      primaryFilters: [
        {
          name: "cases.filter_by.sex",
          field_name: "sex",
          option_strings_source: "lookup-gender",
          options: [],
          type: "checkbox"
        },
        {
          name: "cases.filter_by.risk_level",
          field_name: "risk_level",
          option_strings_source: "lookup-risk-level",
          options: [],
          type: "chips"
        },
        {
          name: "cases.filter_by.no_activity",
          field_name: "last_updated_at",
          option_strings_source: null,
          options: [],
          type: "checkbox"
        }
      ],
      defaultFilterNames: ["protection_concerns", "record_state", "sex"],
      filters: [
        {
          name: "cases.filter_by.social_worker",
          field_name: "owned_by",
          options: [
            {
              id: "sust-mgr-ic",
              display_name: "sust-mgr-ic"
            }
          ],
          type: "checkbox"
        },
        {
          name: "cases.filter_by.workflow",
          field_name: "workflow",
          option_strings_source: null,
          options: {
            en: [
              {
                id: "new",
                display_text: "New"
              },
              {
                id: "closed",
                display_text: "Closed"
              }
            ]
          },
          type: "checkbox"
        },
        {
          name: "cases.filter_by.status",
          field_name: "status",
          option_strings_source: "lookup-case-status",
          options: [],
          type: "checkbox"
        },
        {
          name: "cases.filter_by.sex",
          field_name: "sex",
          option_strings_source: "lookup-gender",
          options: [],
          type: "checkbox"
        },
        {
          name: "cases.filter_by.protection_concerns",
          field_name: "protection_concerns",
          option_strings_source: "lookup-protection-concerns",
          options: [],
          type: "checkbox"
        },
        {
          name: "cases.filter_by.risk_level",
          field_name: "risk_level",
          option_strings_source: "lookup-risk-level",
          options: [],
          type: "chips"
        },
        {
          name: "cases.filter_by.current_location",
          field_name: "location_current",
          option_strings_source: "Location",
          options: [],
          type: "multi_select"
        },
        {
          name: "location.base_types.district",
          field_name: "owned_by_location2",
          option_strings_source: "ReportingLocation",
          options: [],
          type: "multi_select"
        },
        {
          name: "cases.filter_by.no_activity",
          field_name: "last_updated_at",
          option_strings_source: null,
          options: [],
          type: "checkbox"
        },
        {
          name: "cases.filter_by.enabled_disabled",
          field_name: "record_state",
          option_strings_source: null,
          options: {
            en: [
              {
                id: "true",
                display_name: "Enabled"
              },
              {
                id: "false",
                display_name: "Disabled"
              }
            ]
          },
          type: "multi_toggle"
        }
      ],
      locale: "en",
      more: false,
      moreSectionKeys: [],
      queryParamsKeys: ["record_state", "protection_concerns", "page", "per"]
    };

    expect(calculateFilters(params)).toEqual(expected);
  });
});
