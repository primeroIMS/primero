import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map } from "immutable";
import { Chip } from "@material-ui/core";
import Chips from "./component";


describe("<Chips /> - Component", () => {
  const mockedData = {
    id: "risk_level",
    display_name: "Risk Level",
    type: "chips",
    reset: true,
    options: {
      values: [
        {
          id: "high",
          display_name: "High",
          css_color: "red",
          filled: true
        },
        {
          id: "medium",
          display_name: "Medium",
          css_color: "orange",
          filled: true
        },
        {
          id: "low",
          display_name: "Low",
          css_color: "orange",
          filled: false
        },
        {
          id: "no_action",
          display_name: "No Action",
          css_color: "darkGrey",
          filled: false
        }
      ]
    }
  }
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
    expect(component.find(Chip)).to.have.length(4);
  });

});