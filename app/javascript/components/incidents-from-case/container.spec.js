import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import { RECORD_TYPES } from "../../config";
import { FieldRecord } from "../record-form/records";
import { mapEntriesToRecord } from "../../libs";

import IncidentFromCase from "./container";

describe("<IncidentFromCase /> - Component", () => {
  const props = {
    record: fromJS({
      id: "e084120c-c7d1-4dcb-af28-6213b84fbe8d",
      module_id: "primeromodule-gbv"
    }),
    incidents: fromJS([
      {
        created_by: "primero_gbv",
        module_id: "primeromodule-gbv",
        incident_date: "2020-02-16",
        owned_by: "primero_gbv",
        date_of_first_report: "2020-10-04",
        gbv_sexual_violence_type: "test1",
        unique_id: "e25c5cb1-1257-472e-b2ec-05f568a3b51e"
      }
    ]),
    mobileDisplay: false,
    handleToggleNav: () => {},
    mode: { isShow: false, isEdit: true },
    setFieldValue: () => {},
    handleSubmit: () => {},
    recordType: RECORD_TYPES.cases
  };

  const fields = {
    1: {
      name: "gbv_sexual_violence_type",
      type: "select_field",
      option_strings_source: "lookup lookup-gbv-sexual-violence-type",
      display_name: { en: "First Name" }
    }
  };

  const initialState = fromJS({
    forms: {
      options: {
        lookups: [
          {
            id: 1,
            unique_id: "lookup-gbv-sexual-violence-type",
            name: {
              en: "Gbv Sexual Violence Type"
            },
            values: [
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
            ]
          }
        ]
      },
      fields: mapEntriesToRecord(fields, FieldRecord)
    },
    user: {
      permissions: {
        cases: ["incident_from_case"]
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<IncidentFromCase {...props} />, initialState);
  });

  it("render IncidentFromCase component", () => {
    expect(screen.getByText("incidents.label")).toBeInTheDocument();
  });

  it("render IncidentPanel component", () => {
    expect(screen.getByTestId("panel")).toBeInTheDocument();
  });

  it("render IncidentDetail component", () => {
    expect(screen.getByText("incidents.date_of_incident")).toBeInTheDocument();
  });

  it("render a DisplayData with action button", () => {
    expect(screen.getAllByRole("button")).toBeTruthy();
  });

  it("render RecordFormAlerts component", () => {
    const stateWithAlerts = initialState.setIn(
      ["records", "cases", "recordAlerts"],
      fromJS([
        {
          alert_for: "field_change",
          type: "incident_from_case",
          date: "2021-12-21",
          form_unique_id: "incident_from_case"
        }
      ])
    );

    mountedComponent(<IncidentFromCase {...props} />, stateWithAlerts);
    expect(screen.getByText("messages.alerts_for.field_change")).toBeInTheDocument();
  });
});
