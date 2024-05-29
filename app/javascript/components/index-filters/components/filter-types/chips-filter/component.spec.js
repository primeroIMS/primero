import { screen, mountedFormComponent, userEvent } from "test-utils";

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
    addFilterToList: () => {},
    filter
  };

  it("renders panel", () => {
    mountedFormComponent(<ChipsFilter {...props} />, { includeFormProvider: true });
    expect(screen.getByText("Filter 1")).toBeInTheDocument();
  });

  it("renders chip inputs", () => {
    mountedFormComponent(<ChipsFilter {...props} />, { includeFormProvider: true });
    ["Option 1", "Option 2"].forEach(option => expect(screen.getByText(`${option}`)).toBeInTheDocument());
  });

  it("should have not call setMoreSectionFilters if mode.secondary is false when changing value", async () => {
    const setMoreSectionFiltersSpy = jest.fn();
    const newProps = {
      addFilterToList: () => {},
      filter,
      mode: {
        secondary: false
      },
      moreSectionFilters: {},
      reset: false,
      setMoreSectionFilters: setMoreSectionFiltersSpy,
      setReset: () => {}
    };
    const user = userEvent.setup();

    mountedFormComponent(<ChipsFilter {...newProps} />, { includeFormProvider: true });
    await user.click(screen.getByText("Option 1"));
    expect(setMoreSectionFiltersSpy).not.toHaveBeenCalled();
  });
});
