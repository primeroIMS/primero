import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map, List } from "immutable";
import { IconButton, InputBase } from "@material-ui/core";
import RecordSearch from "./component";

describe("<RecordSearch />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      RecordSearch,
      {
        namespace: "Cases",
        path: "/cases",
        data: {
          id: "b54d7888-5606-46b9-ba14-08a2cc63c524",
          name: "Test",
          case_id_display: "491aa9e",
          registration_date: "2019-07-30"
        },
        getRecords: () => {}
      },
      Map({
        records: Map({
          Cases: Map({
            data: List([Map({ id: "test", sex: "male", age: 12 })]),
            metadata: Map({ per: 20, page: 1 }),
            filters: Map({ status: "open" })
          })
        })
      })
    ).component;
  });

  it("renders IconButton", () => {
    expect(component.find(IconButton)).to.have.length(1);
  });

  it("renders InputBase", () => {
    expect(component.find(InputBase)).to.have.length(1);
  });
});
