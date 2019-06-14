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
          cases: List([Map({ id: "test", sex: "male", age: 12 })]),
          metadata: Map({ per: 20, page: 1 }),
          filters: Map({ status: "open" })
        })
      })
    ).component;
  });

  // TODO: Test fails. Due to how fetchCases action is setup
  // "Actions must be plain objects. Use custom middleware for async action"
  it("renders cases table", () => {
    expect(component.find(IndexTable)).to.have.length(1);
  });
});
