import { expect } from "chai";
import { setupMountedComponent } from "test";
import "test/test.setup";

import { IndexTable } from "components/index-table";
import CaseList from "./container";

describe("<CaseList />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(CaseList).component;
  });

  it("renders cases table", () => {
    expect(component.find(IndexTable)).to.have.length(1);
  });

  it("fetches cases on mount", () => {
    // sinon.spy(component.instance(), "fetchCases");
    // expect(spy).toHaveBeenCalled()
  })
});
