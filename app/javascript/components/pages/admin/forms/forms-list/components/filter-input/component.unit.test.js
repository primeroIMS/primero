import { setupMountedComponent, expect } from "../../../../../../../test";

import FilterInput from "./component";

describe("<FormsList />/components/<FilterInput />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(FilterInput));
  });

  it.skip("renders toggle input with options", () => {});
  it.skip("responds to onChange with passed function", () => {});
});
