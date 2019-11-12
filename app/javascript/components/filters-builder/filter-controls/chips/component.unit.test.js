import { expect } from "chai";
import { Map } from "immutable";
import { Chip } from "@material-ui/core";

import { setupMountedComponent } from "../../../../test";

import Chips from "./component";


describe("<Chips /> - Component", () => {
  const mockedData = {
    name: "Risk Level",
    field_name: "risk_level",
    type: "chips",
    options: {
      en: [
        {
          id: "high",
          display_name: "High"
        },
        {
          id: "medium",
          display_name: "Medium"
        },
        {
          id: "low",
          display_name: "Low"
        },
        {
          id: "no_action",
          display_name: "No Action"
        }
      ],
      es: [
        {
          id: "high",
          display_name: "Alto"
        },
        {
          id: "medium",
          display_name: "Medio"
        },
        {
          id: "low",
          display_name: "Bajo"
        },
        {
          id: "no_action",
          display_name: "Sin Acción"
        }
      ]
    }
  };
  let component;

  before(() => {
    component = setupMountedComponent(
      Chips,
      { recordType: "case", props: mockedData },
      Map({
        records: Map({
          Cases: {
            filters: {
              risk_level: []
            }
          }
        })
      })
    ).component;
  });

  it("renders the Chip", () => {
    expect(component.find(Chip)).to.have.lengthOf(4);
  });
});
