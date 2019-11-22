import { expect } from "chai";
import { Map, List } from "immutable";
import { ExpansionPanel, Button } from "@material-ui/core";

import { setupMountedComponent } from "../../test";
import { FilterRecord } from "../user/records";

import FiltersBuilder from "./container";
import FiltersActions from "./filters-actions";

describe("<Filters /> - Component", () => {
  let component;
  const filtersApi = List([
    FilterRecord({
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
      { recordType: "Cases", filters: filtersApi, defaultFilters: Map({}) },
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
    expect(component.find(Button)).to.have.lengthOf(3);
  });

  it("renders the ExpansionPanel", () => {
    expect(component.find(ExpansionPanel)).to.have.lengthOf(1);
  });

  it("renders one FiltersActions", () => {
    expect(component.find(FiltersActions)).to.have.lengthOf(1);
  });
});
