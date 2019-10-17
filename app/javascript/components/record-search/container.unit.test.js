import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map, List } from "immutable";
import { IconButton, InputBase } from "@material-ui/core";
import { setFilters } from "components/records";
import RecordSearch from "./container";

describe("<RecordSearch />", () => {
  let component;

  before(() => {
    const initialState = Map({
      records: Map({
        cases: Map({
          filters: Map({
            id_search: false,
            query: "Jose"
          })
        })
      })
    });

    const props = {
      recordType: "cases",
      setFilters
    };

    ({ component } = setupMountedComponent(RecordSearch, props, initialState, [
      "/cases"
    ]));
  });

  it("renders IconButton", () => {
    expect(component.find(IconButton)).to.have.length(1);
  });

  it("renders InputBase", () => {
    expect(component.find(InputBase)).to.have.length(1);
  });
});
