import { setupMockFormComponent, expect } from "../../../../test";

import SwitchFilter from "./switch-filter";
import CheckboxFilter from "components/index-filters/components/filter-types/checkbox-filter";
import DateFilter from "components/index-filters/components/filter-types/date-filter";

describe("<SwitchFilter>", () => {
  const props = {
    filter: {
      field_name: "filter",
      name: "Filter 1",
      options: {
        "en": [
          {
            "id": "true",
            "display_name": "Option 1"
          }
        ],
      }
    }
  };

  it("renders panel", () => {
    const { component } = setupMockFormComponent(SwitchFilter, props);

    expect(component.exists("Panel")).to.be.true;
  });

  it("renders checkbox", () => {
    const { component } = setupMockFormComponent(CheckboxFilter, props);

    expect(component.exists("input[type='checkbox']")).to.be.true
  });
});
