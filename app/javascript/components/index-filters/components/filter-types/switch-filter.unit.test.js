import { setupMockFormComponent, expect } from "../../../../test";

import SwitchFilter from "./switch-filter";

describe("<SwitchFilter>", () => {
  const props = {
    filter: {
      field_name: "filter",
      name: "Filter 1",
      options: {
        en: [
          {
            id: "true",
            display_name: "Option 1"
          }
        ]
      }
    }
  };

  it("renders panel", () => {
    const { component } = setupMockFormComponent(SwitchFilter, props);

    expect(component.exists("Panel")).to.be.true;
  });

  it("renders switch", () => {
    const { component } = setupMockFormComponent(SwitchFilter, props);

    expect(component.exists("input[type='checkbox']")).to.be.true;
  });
});
