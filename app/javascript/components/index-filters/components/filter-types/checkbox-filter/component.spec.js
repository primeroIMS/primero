import { mountedComponent, screen, setupMockFormComponent, spy } from "test-utils";
import CheckboxFilter from "./component";

describe("<CheckboxFilter>", () => {
  const filter = {
    field_name: "filter",
    name: "Filter 1",
    options: [
      { id: "option-1", display_text: "Option 1" },
      { id: "option-2", display_text: "Option 2" }
    ]
  };

  const props = { addFilterToList: () => { }, filter };

  it("renders panel", () => {
    setupMockFormComponent(CheckboxFilter, { props, includeFormProvider: true });
    expect(screen.getByText("Filter 1")).toBeInTheDocument();
  });

  it("renders checkbox inputs", () => {
    setupMockFormComponent(CheckboxFilter, { props, includeFormProvider: true });
    ["Option 1", "Option 2"].forEach(option =>
      expect(screen.getByText(`${option}`)).toBeInTheDocument());
  });

  //   it("should have not call setMoreSectionFilters if mode.secondary is false when changing value", () => {
  //     const newProps = {
  //       addFilterToList: () => {},
  //       filter,
  //       mode: {
  //         secondary: false
  //       },
  //       moreSectionFilters: {},
  //       reset: false,
  //       setMoreSectionFilters: spy(),
  //       setReset: () => {}
  //     };

  //     setupMockFormComponent(CheckboxFilter, { props: newProps, includeFormProvider: true });

  //     const checkbox = document.querySelector(`input[name="Option 1"]`);
  //     console.log("divyanshu--",checkbox)
  //     //expect(checkbox).toBeInTheDocument();
  //     //userEvent.click(checkbox);

  //     //expect(newProps.setMoreSectionFilters).not.toHaveBeenCalled();
  //   });  
});




