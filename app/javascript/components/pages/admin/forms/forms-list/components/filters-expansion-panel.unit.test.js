import { setupMountedComponent, expect } from "../../../../../../test";

import FiltersExpansionPanel from "./filters-expansion-panel";

describe("<FormsList />/components/<FiltersExpansionPanel />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(FiltersExpansionPanel));
  });

  xit("renders <ExpansionPanel /> with name", () => {});
  xit("renders <FilterInput />", () => {});
});
