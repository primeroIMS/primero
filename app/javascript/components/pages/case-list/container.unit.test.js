import { expect } from "chai";
import { setupMountedComponent } from "test";
import "test/test.setup";
import { Map, List } from "immutable";

import { IndexTable } from "components/index-table";
import CaseList from "./container";

describe("<CaseList />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      CaseList,
      {},
      Map({
        Cases: Map({
          records: List([Map({ id: "test", sex: "male", age: 12 })]),
          metadata: Map({ per: 20, page: 1 }),
          filters: Map({ status: "open" })
        })
      })
    ).component;
  });

  it("renders cases table", () => {
    expect(component.find(IndexTable)).to.have.length(1);
  });
});
