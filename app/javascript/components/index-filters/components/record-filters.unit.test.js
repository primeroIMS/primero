// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../test";

import RecordFilters from "./record-filters";

describe("<RecordFilters>", () => {
  const state = fromJS({});

  const props = {
    addFilterToList: () => {},
    defaultFilters: fromJS([
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
    ]),
    filters: fromJS([
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
    ]),
    more: false,
    moreSectionFilters: {},
    primaryFilters: fromJS([
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
    ]),
    queryParams: {
      record_state: ["true"],
      protection_concerns: ["child_survivor_of_explosive"]
    },
    recordType: "cases",
    reset: false,
    setMoreSectionFilters: () => {},
    setReset: () => {}
  };

  it("renders RecordFilters component", () => {
    const { component } = setupMountedComponent(RecordFilters, props, state);

    expect(component.find(RecordFilters)).to.have.lengthOf(1);
  });

  it("renders valid props for RecordFilters component", () => {
    const { component } = setupMountedComponent(RecordFilters, props, state);

    const clone = { ...component.find(RecordFilters).props() };

    [
      "addFilterToList",
      "defaultFilters",
      "filters",
      "more",
      "moreSectionFilters",
      "primaryFilters",
      "queryParams",
      "recordType",
      "reset",
      "setReset",
      "setMoreSectionFilters"
    ].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
