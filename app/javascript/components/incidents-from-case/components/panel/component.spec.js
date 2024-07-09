// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { RECORD_TYPES } from "../../../../config";
import { FieldRecord } from "../../../record-form/records";
import { mapEntriesToRecord } from "../../../../libs";

import IncidentPanel from "./component";

describe("<IncidentPanel /> - Component", () => {
  const props = {
    incident: fromJS({
      created_by: "primero_gbv",
      module_id: "primeromodule-gbv",
      incident_date: "2020-09-16",
      owned_by: "primero_gbv",
      date_of_first_report: "2020-10-04",
      gbv_sexual_violence_type: "test1",
      cp_incident_violence_type: "test1",
      unique_id: "e25c5cb1-1257-472e-b2ec-05f568a3b51e"
    }),
    incidentCaseId: "case-id-1",
    css: {},
    mode: { isShow: false, isEdit: true },
    setFieldValue: () => {},
    handleSubmit: () => {},
    recordType: RECORD_TYPES.cases
  };

  const values = [
    {
      id: "test1",
      display_text: {
        en: "Test1"
      }
    },
    {
      id: "test2",
      display_text: {
        en: "Test2"
      }
    }
  ];

  const fields = {
    1: {
      name: "gbv_sexual_violence_type",
      type: "select_field",
      option_strings_source: "lookup lookup-gbv-sexual-violence-type",
      display_name: { en: "First Name" }
    }
  };

  const initialState = fromJS({
    application: {
      modules: [
        {
          unique_id: "primeromodule-cp",
          field_map: {
            fields: [],
            map_to: "primeromodule-cp"
          },
          name: "CP",
          associated_record_types: ["case", "tracing_request", "incident"],
          options: {
            allow_searchable_ids: true,
            use_workflow_case_plan: true,
            use_workflow_assessment: false,
            reporting_location_filter: true,
            use_workflow_service_implemented: true
          },
          workflows: {}
        }
      ]
    },
    forms: {
      options: {
        lookups: [
          {
            id: 1,
            unique_id: "lookup-gbv-sexual-violence-type",
            name: {
              en: "Gbv Sexual Violence Type"
            },
            values
          },
          {
            id: 2,
            unique_id: "lookup-cp-violence-type",
            name: {
              en: "CP Sexual Violence Type"
            },
            values
          }
        ]
      },
      fields: mapEntriesToRecord(fields, FieldRecord)
    }
  });

  beforeEach(() => {
    mountedComponent(<IncidentPanel {...props} />, initialState);
  });

  it("render IncidentPanel component", () => {
    expect(screen.getByTestId("incident-panel")).toBeInTheDocument();
  });

  it("render IncidentSummary component", () => {
    expect(screen.getAllByTestId("incidentsummary")).toHaveLength(1);
  });

  it("render IncidentDetail component", () => {
    expect(screen.getByText("incidents.date_of_incident")).toBeInTheDocument();
  });

  it("with violence-type-lookup-renders the translated value", () => {
    expect(screen.getAllByText("Test1")).toHaveLength(2);
  });
});
