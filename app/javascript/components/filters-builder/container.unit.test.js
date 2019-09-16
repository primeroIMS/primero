import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map, List } from "immutable";
import { ExpansionPanel, Button } from "@material-ui/core";
import * as Record from "components/user/records";
import FiltersBuilder from "./container";

describe("<Filters /> - Component", () => {
  let component;
  const filtersApi = List([
    Record.FilterRecord({
      name: "cases.filter_by.flag",
      field_name: "flagged",
      options: {
        en: [
          {
            id: "true",
            display_name: "Flagged?"
          }
        ],
        es: [
          {
            id: "true",
            display_name: "Marcado?"
          }
        ]
      },
      type: "checkbox"
    })
  ]);

  before(() => {
    component = setupMountedComponent(
      FiltersBuilder,
      { recordType: "case", filters: filtersApi },
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
    expect(component.find(Button)).to.have.length(2);
  });

  it("renders the ExpansionPanel", () => {
    expect(component.find(ExpansionPanel)).to.have.length(1);
  });

});