import { setupMountedComponent, expect } from "../../../../../../test";

import FilterInput from "./filter-input";

describe("<FormsList />/components/<FilterInput />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(FilterInput));
  });

  xit("renders toggle input with options", () => {});
  xit("responds to onChange with passed function", () => {});
});
