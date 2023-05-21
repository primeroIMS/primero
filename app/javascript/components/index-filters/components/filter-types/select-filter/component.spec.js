import { screen, setupMockFormComponent } from "test-utils";
import SelectFilter from "./component";

describe("<SelectFilter>", () => {
  const filter = {
    field_name: "filter",
    name: "Filter 1",
    options: [
      { id: "option-1", display_text: "Option 1" },
      { id: "option-2", display_text: "Option 2" }
    ]
  };

  const props = {
    addFilterToList: () => { },
    filter
  };

  it("renders panel", () => {
    setupMockFormComponent(SelectFilter, { props, includeFormProvider: true });
    expect(screen.getByText("Filter 1")).toBeInTheDocument();
  });
});




