import { setupMockFormComponent, expect } from "../../../../test";

import SelectFilter from "./select-filter";

describe("<SelectFilter>", () => {
  const props = {
    filter: {
      field_name: "filter",
      name: "Filter 1",
      options: [
        { id: "option-1", display_text: "Option 1" },
        { id: "option-2", display_text: "Option 2" }
      ]
    }
  };

  it("renders panel", () => {
    const { component } = setupMockFormComponent(SelectFilter, props);

    expect(component.exists("Panel")).to.be.true;
  });
});
