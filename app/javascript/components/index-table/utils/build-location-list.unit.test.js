// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import buildLocationsList from "./build-location-list";

describe("buildLocationsList", () => {
  const records = fromJS([
    {
      last_updated_at: "2023-03-07T20:46:11.710Z",
      enabled: true,
      incident_location: "UA0104053",
      owned_by_agency_id: "UNICEF",
      created_at: "2023-03-07T20:46:11.707Z",
      owned_by: "primero",
      status: "open",
      violation_category: ["killing"],
      date_of_first_report: "2023-03-07",
      type: "incidents",
      id: "15371e94-89f1-45d2-a622-19146c923e8d",
      incident_date: "2023-02-25",
      flag_count: 0,
      reporting_location_hierarchy: "UA.UA01.UA0104.UA0104053",
      complete_sortable: 0,
      short_id: "58834c3"
    },
    {
      last_updated_at: "2023-02-23T16:02:44.301Z",
      enabled: true,
      incident_location: null,
      owned_by_agency_id: "UNICEF",
      created_at: "2023-02-23T16:02:44.266Z",
      owned_by: "test_user",
      status: "open",
      violation_category: [],
      date_of_first_report: "2022-07-17",
      type: "incidents",
      id: "73c5fd87-b258-498b-8c0e-e8e8727e439b",
      incident_date: "2022-07-29",
      flag_count: 0,
      complete_sortable: 0,
      short_id: "daa5d9b"
    },
    {
      last_updated_at: "2023-03-07T20:45:03.415Z",
      enabled: true,
      incident_location: "UA0156",
      owned_by_agency_id: "UNICEF",
      created_at: "2023-02-23T16:02:44.267Z",
      owned_by: "test_user",
      status: "open",
      violation_category: [],
      date_of_first_report: "2022-07-17",
      type: "incidents",
      id: "046c2f40-a5f5-4783-b620-f242c5f679db",
      incident_date: "2022-08-01",
      flag_count: 0,
      complete_sortable: 0,
      short_id: "c83a398"
    }
  ]);

  const columnsWithLookups = fromJS([
    {
      autosum_total: false,
      collapse: null,
      date_include_time: false,
      date_validation: "default_date_validation",
      disabled: false,
      display_name: {
        en: "Relevant violations"
      },
      editable: true,
      form_section_id: 1529,
      form_section_name: null,
      guiding_questions: "",
      help_text: {},
      hidden_text_field: false,
      hide_on_view_page: false,
      href: null,
      link_to_form: "",
      module_ids: ["primeromodule-mrm"],
      multi_select: true,
      name: "violation_category",
      option_strings_condition: null,
      option_strings_source: "lookup lookup-violation-type",
      option_strings_text: null,
      order: 5,
      parent_form: "incident",
      required: true,
      selected_value: null,
      show_on_minify_form: false,
      showIf: null,
      subform_section_configuration: null,
      subform_section_id: null,
      subform_sort_by: "",
      tally: {},
      tick_box_label: {},
      type: "select_box",
      visible: true,
      watchedInputs: null,
      calculation: {}
    },
    {
      autosum_total: false,
      collapse: null,
      date_include_time: false,
      date_validation: "default_date_validation",
      disabled: false,
      display_name: {
        en: "Incident location"
      },
      editable: true,
      form_section_id: 1529,
      form_section_name: null,
      guiding_questions: "",
      help_text: {},
      hidden_text_field: false,
      hide_on_view_page: false,
      href: null,
      link_to_form: "",
      module_ids: ["primeromodule-mrm"],
      multi_select: false,
      name: "incident_location",
      option_strings_condition: null,
      option_strings_source: "Location",
      option_strings_text: null,
      order: 14,
      parent_form: "incident",
      required: true,
      selected_value: null,
      show_on_minify_form: false,
      showIf: null,
      subform_section_configuration: null,
      subform_section_id: null,
      subform_sort_by: "",
      tally: {},
      tick_box_label: {},
      type: "select_box",
      visible: true,
      watchedInputs: null,
      calculation: {}
    }
  ]);

  const expected = ["UA0104053", "UA", "UA01", "UA0104", null, "UA0156"];

  it("should return an array of locations code", () => {
    const result = buildLocationsList(records, columnsWithLookups);

    expect(result).toEqual(expected);
  });
});
