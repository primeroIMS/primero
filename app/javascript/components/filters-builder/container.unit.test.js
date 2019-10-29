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
      { recordType: "Cases", filters: filtersApi, defaultFilters: Map({}) },
      Map({
        records: Map({
          FiltersBuilder: {
            Cases: [],
            Incidents: [],
            TracingRequest: []
          }
        }),
        filters: {
          "2": [],
          "flagged": [],
          "marked_for_mobile": [],
          "owned_by": [],
          "my_cases[owned_by]": [],
          "my_cases[assigned_user_names]": [],
          "workflow": [],
          "owned_by_agency": [],
          "status": [],
          "age": ["0..5"],
          "sex": ["female"],
          "approval_status_bia": [],
          "approval_status_case_plan": [],
          "approval_status_closure": [],
          "protection_concerns": [],
          "gbv_displacement_status": [],
          "protection_status": [],
          "urgent_protection_concern": [],
          "risk_level": [],
          "location_current": [],
          "created_agency_office": [],
          "owned_by_groups": [],
          "last_updated_at": [],
          "has_photo": [],
          "id_search": false,
          "query": ""
        }
      })
    ).component;
  });

  it("renders the Action Buttons", () => {
    expect(component.find(Button)).to.have.length(3);
  });

  it("renders the ExpansionPanel", () => {
    expect(component.find(ExpansionPanel)).to.have.length(1);
  });
});