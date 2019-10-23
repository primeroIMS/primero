import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map } from "immutable";
import { AppBar, Tabs, Tab } from "@material-ui/core";
import { FiltersBuilder } from "components/filters-builder";
import Filters from "./container";
import FiltersBuilder from "./container";
import { setInitialFilterValues } from "./action-creators";

describe("<Filters /> - Component", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      Filters,
      { recordType: "case", tabValue: 0 },
      Map({
        records: Map({
          Cases: {
            filters: {
              my_cases: [],
              social_worker: [],
              approval_status: [],
              status: [],
              age_range: "",
              sex: "",
              risk_level: [],
              fields: "short",
              status: "open",
              record_state: true
            },
            data: {
              0: {
                id: "3244d868-0e5b-453a-a381-7dfcdd3c3cc7",
                age: 6,
                sex: "male",
                name: "Andres Iniesta",
                owned_by: "primero",
                created_at: "2019-05-27T23:00:43.758Z",
                case_id_display: "040e0b7",
                registration_date: "2019-05-27"
              },
              1: {
                id: "6b3c2109-fd5e-4d5f-83dc-56c72398eafa",
                age: 10,
                sex: "male",
                name: "Lionel Messi",
                owned_by: "primero",
                created_at: "2019-05-24T17:12:08.362Z",
                case_id_display: "cdfbb3b",
                registration_date: "2019-05-24"
              }
            }
          }
        })
      })
    ).component;
  });

  it("renders the Tabs", () => {
    expect(component.find(Tabs)).to.have.length(1);
  });

  it("renders the Tab", () => {
    expect(component.find(Tab)).to.have.length(2);
  });

  it("renders the FiltersBuilder", () => {
    expect(component.find(FiltersBuilder)).to.have.length(1);
  });
});
