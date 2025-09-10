import { screen, mountedFormComponent } from "test-utils";

import DatePickers from "./date-pickers";

describe("<DatePickers>", () => {
  const props = {
    dateIncludeTime: false,
    inputValue: ["2025-07-28"],
    mode: { secondary: false },
    moreSectionFilters: {},
    selectedField: "sample",
    setInputValue: () => {},
    setMoreSectionFilters: () => {},
    setValue: () => {},
    register: () => {}
  };

  it("renders panel", () => {
    mountedFormComponent(<DatePickers {...props} />, { includeFormProvider: true });
    expect(screen.getAllByText("fields.date_range.from", { selector: "span" })).toHaveLength(1);
    expect(screen.getAllByText("fields.date_range.to", { selector: "span" })).toHaveLength(1);
  });
});
