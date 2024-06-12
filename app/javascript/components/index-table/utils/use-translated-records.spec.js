// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, OrderedMap } from "immutable";

import { setupHook } from "../../../test-utils";
import { FieldRecord } from "../../record-form";

import { useTranslatedRecords } from "./use-translated-records";

describe("useTranslatedRecords", () => {
  const records = fromJS([
    {
      incident_location: "UA0104053",
      reporting_location_hierarchy: "UA.UA01.UA0104.UA0104053",
      short_id: "58834c3"
    },
    {
      incident_location: null,
      short_id: "daa5d9b"
    },
    {
      incident_location: "UA0156",
      short_id: "c83a398",
      reporting_location_hierarchy: "UA.UA01.UA0156"
    }
  ]);
  const columnsName = fromJS(["short_id", "incident_location"]);
  const validRecordTypes = true;
  const useReportingLocations = true;
  const recordType = "incidents";

  const initialState = fromJS({
    forms: {
      fields: OrderedMap({
        0: FieldRecord({
          id: 1,
          name: "short_id",
          type: "text_field",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "Incident ID"
          },
          subform_section_id: null,
          help_text: {},
          multi_select: null,
          option_strings_source: null,
          option_strings_text: null,
          guiding_questions: "",
          required: true,
          date_validation: "default_date_validation"
        }),
        1: FieldRecord({
          id: 1,
          name: "incident_location",
          type: "select_box",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "Incident location"
          },
          subform_section_id: null,
          help_text: {},
          multi_select: null,
          option_strings_source: "Location",
          option_strings_text: null,
          guiding_questions: "",
          required: true,
          date_validation: "default_date_validation"
        })
      }),
      options: {
        locations: [
          {
            id: 1,
            code: "UA",
            type: "country",
            admin_level: 0,
            name: {
              en: "Country 1"
            }
          },
          {
            id: 2,
            code: "UA01",
            type: "region",
            admin_level: 1,
            name: {
              en: "Region 1"
            }
          },
          {
            id: 3,
            code: "UA0104",
            type: "State",
            admin_level: 2,
            name: {
              en: "State 1"
            }
          },
          {
            id: 4,
            code: "UA0156",
            type: "State",
            admin_level: 2,
            name: {
              en: "State 2"
            }
          },
          {
            id: 5,
            code: "UA0104053",
            type: "city",
            admin_level: 3,
            name: {
              en: "City 1"
            }
          },
          {
            id: 6,
            code: "UA0104054",
            type: "city",
            admin_level: 3,
            name: {
              en: "City 2"
            }
          }
        ]
      }
    },
    application: {
      incidentReportingLocationConfig: {
        field_key: "incident_location",
        admin_level: 2,
        admin_level_map: {
          1: ["province"],
          2: ["district"]
        }
      }
    }
  });

  it("should return a string with reportingLocation", () => {
    const expected = [
      {
        incident_location: "State 1",
        reporting_location_hierarchy: "UA.UA01.UA0104.UA0104053",
        short_id: "58834c3"
      },
      { incident_location: undefined, short_id: "daa5d9b" },
      {
        incident_location: "State 2",
        short_id: "c83a398",
        reporting_location_hierarchy: "UA.UA01.UA0156"
      }
    ];
    const { result } = setupHook(
      () => useTranslatedRecords({ records, columnsName, validRecordTypes, useReportingLocations, recordType }),
      initialState
    );

    expect(result.current.toJS()).toStrictEqual(expected);
  });
});
