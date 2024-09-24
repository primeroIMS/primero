import { screen, mountedFormComponent, fireEvent } from "test-utils";

import SwitchFilter from "./component";

describe("<SwitchFilter>", () => {
  const filter = {
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
  };

  const props = {
    addFilterToList: () => {},
    filter
  };

  it("renders panel", () => {
    mountedFormComponent(<SwitchFilter {...props} />, { includeFormProvider: true });
    expect(screen.getByText("Filter 1")).toBeInTheDocument();
  });

  it("renders switch", () => {
    mountedFormComponent(<SwitchFilter {...props} />, { includeFormProvider: true });
    const checkbox = document.querySelector('input[type="checkbox"]');

    expect(checkbox).toBeInTheDocument();
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

    mountedFormComponent(<SwitchFilter {...newProps} />, { includeFormProvider: true });
    const checkbox = document.querySelector('input[type="checkbox"]');

    fireEvent.click(checkbox);
    expect(setMoreSectionFiltersSpy).not.toHaveBeenCalled();
  });
});
