import { screen, setupMockFormComponent } from "test-utils";
import ChipsFilter from "./component";

describe("<ChipsFilter>", () => {
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
    setupMockFormComponent(ChipsFilter, { props, includeFormProvider: true });
    expect(screen.getByText("Filter 1")).toBeInTheDocument();
  });

  it("renders chip inputs", () => {
    setupMockFormComponent(ChipsFilter, { props, includeFormProvider: true });
    ["Option 1", "Option 2"].forEach(option =>
      expect(screen.getByText(`${option}`)).toBeInTheDocument());
  });
});




