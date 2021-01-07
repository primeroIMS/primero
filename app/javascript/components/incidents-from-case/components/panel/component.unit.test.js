import { fromJS } from "immutable";
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";
import IncidentSummary from "../summary";
import IncidentDetail from "../detail";
import { RECORD_TYPES, MODULES } from "../../../../config";

import IncidentPanel from "./component";

describe("<IncidentPanel /> - Component", () => {
  let component;
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
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(IncidentPanel, props, initialState));
  });

  it("render IncidentPanel component", () => {
    expect(component.find(IncidentPanel)).to.have.length(1);
  });

  it("render a ExpansionPanels", () => {
    expect(component.find(ExpansionPanel)).to.have.lengthOf(1);
    expect(component.find(ExpansionPanelSummary)).to.have.lengthOf(1);
    expect(component.find(ExpansionPanelDetails)).to.have.lengthOf(1);
  });

  it("render a IncidentSummary", () => {
    expect(component.find(IncidentSummary)).to.have.lengthOf(1);
  });

  it("render a IncidentDetail", () => {
    expect(component.find(IncidentDetail)).to.have.lengthOf(1);
  });

  describe("with violence-type-lookup", () => {
    describe("when transition module is GBV", () => {
      let componentWithGbvViolenceType;

      beforeEach(() => {
        ({ component: componentWithGbvViolenceType } = setupMountedComponent(IncidentPanel, props, initialState));
      });

      it("should use lookup-gbv-sexual-violence-type", () => {
        const { props: incidentDetailProps } = componentWithGbvViolenceType.find(IncidentDetail).props().incidentType;
        const expected = { value: "test1", optionsStringSource: "lookup-gbv-sexual-violence-type" };

        expect(incidentDetailProps).to.deep.equals(expected);
      });
    });
    describe("with violence-type-lookup", () => {
      describe("when transition module is CP", () => {
        let componentWithCpViolenceType;

        beforeEach(() => {
          const incident = props.incident.set("module_id", MODULES.CP);

          ({ component: componentWithCpViolenceType } = setupMountedComponent(
            IncidentPanel,
            { ...props, incident },
            initialState
          ));
        });

        it("should use lookup-gbv-sexual-violence-type", () => {
          const { props: incidentDetailProps } = componentWithCpViolenceType.find(IncidentDetail).props().incidentType;
          const expected = { value: "test1", optionsStringSource: "lookup-cp-violence-type" };

          expect(incidentDetailProps).to.deep.equals(expected);
        });
      });
    });
  });

  it("renders component with valid props", () => {
    const incidentsProps = { ...component.find(IncidentPanel).props() };

    ["incident", "incidentCaseId", "css", "mode", "setFieldValue", "handleSubmit", "recordType"].forEach(property => {
      expect(incidentsProps).to.have.property(property);
      delete incidentsProps[property];
    });
    expect(incidentsProps).to.be.empty;
  });
});
