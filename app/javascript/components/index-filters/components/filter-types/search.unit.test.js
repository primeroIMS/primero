import { IconButton, InputBase } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import { setupMockFormComponent, expect } from "../../../../test";

import Search from "./search";

describe("<Search /> index-filters/components/filter-types/search", () => {
  const props = {
    recordType: "cases"
  };

  it("renders IconButton", () => {
    const { component } = setupMockFormComponent(Search, props, {});

    expect(component.find(IconButton)).to.have.lengthOf(2);
  });

  it("renders SearchIcon", () => {
    const { component } = setupMockFormComponent(Search, props, {});

    expect(component.find(SearchIcon)).to.have.lengthOf(1);
  });

  it("renders InputBase", () => {
    const { component } = setupMockFormComponent(Search, props, {});

    expect(component.find(InputBase)).to.have.lengthOf(1);
  });
});
