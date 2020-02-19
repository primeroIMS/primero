import { expect } from "chai";
import { Map } from "immutable";
import { IconButton, InputBase } from "@material-ui/core";

import { setupMountedComponent } from "../../test";
import { setFilters } from "../records";

import RecordSearch from "./container";

describe("<RecordSearch />", () => {
  let component;

  beforeEach(() => {
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
    expect(component.find(IconButton)).to.have.length(2);
  });

  it("renders InputBase", () => {
    expect(component.find(InputBase)).to.have.length(1);
  });

  it("renders InputBase with valid props", () => {
    const inputBaseProps = { ...component.find(InputBase).props() };

    [
      "id",
      "className",
      "placeholder",
      "onKeyUp",
      "onChange",
      "value",
      "inputProps",
      "endAdornment",
      "fullWidth"
    ].forEach(property => {
      expect(inputBaseProps).to.have.property(property);
      delete inputBaseProps[property];
    });
    expect(inputBaseProps).to.be.empty;
  });
});
