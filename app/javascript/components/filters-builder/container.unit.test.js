import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map } from "immutable";
import {
  ExpansionPanel,
  Button
} from "@material-ui/core";
import FiltersBuilder from "./container";
import mockedFilters from "../filters/mocked-filters";

describe("<Filters /> - Component", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      FiltersBuilder,
      { recordType: "case", filters: mockedFilters },
      Map({
        records: Map({
          FiltersBuilder: {
            Cases: [],
            Incidents: [],
            TracingRequest: []
          }
        })
      })
    ).component;
  });

  it("renders the Action Buttons", () => {
    expect(component.find(Button)).to.have.length(3);
  });

  it("renders the ExpansionPanel", () => {
    expect(component.find(ExpansionPanel)).to.have.length(8);
  });

});