import { fromJS } from "immutable";
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";

import { setupMountedComponent } from "../../test";
import RecordFormTitle from "../record-form/form/record-form-title";
import ActionButton from "../action-button";
import { RECORD_TYPES } from "../../config";

import IncidentSummary from "./components/summary";
import IncidentDetail from "./components/detail";
import IncidentFromCase from "./container";

describe("<IncidentFromCase /> - Component", () => {
  let component;
  const props = {
    record: fromJS({
      id: "e084120c-c7d1-4dcb-af28-6213b84fbe8d",
      module_id: "primeromodule-gbv"
    }),
    incidents: fromJS([
      {
        created_by: "primero_gbv",
        module_id: "primeromodule-gbv",
        incident_date: "2020-09-16",
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
      }
    },
    user: {
      permissions: {
        cases: ["incident_from_case"]
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(IncidentFromCase, props, initialState));
  });

  it("render IncidentFromCase container", () => {
    expect(component.find(IncidentFromCase)).to.have.length(1);
  });

  it("render a Accordions", () => {
    expect(component.find(Accordion)).to.have.lengthOf(1);
    expect(component.find(AccordionSummary)).to.have.lengthOf(1);
    expect(component.find(AccordionDetails)).to.have.lengthOf(1);
  });

  it("render a RecordFormTitle", () => {
    expect(component.find(RecordFormTitle)).to.have.lengthOf(1);
  });

  it("render a ActionButton", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(1);
  });

  it("render a IncidentPanel", () => {
    expect(component.find(IncidentSummary)).to.have.lengthOf(1);
  });

  it("render a IncidentSummary", () => {
    expect(component.find(IncidentSummary)).to.have.lengthOf(1);
  });

  it("render a IncidentSummary", () => {
    expect(component.find(IncidentDetail)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const incidentsProps = { ...component.find(IncidentFromCase).props() };

    [
      "record",
      "incidents",
      "mobileDisplay",
      "handleToggleNav",
      "mode",
      "setFieldValue",
      "handleSubmit",
      "recordType"
    ].forEach(property => {
      expect(incidentsProps).to.have.property(property);
      delete incidentsProps[property];
    });
    expect(incidentsProps).to.be.empty;
  });
});
