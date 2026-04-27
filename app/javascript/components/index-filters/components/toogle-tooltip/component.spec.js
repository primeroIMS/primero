import { mountedFormComponent, screen } from "../../../../test-utils";

import ToggleTooltip from "./component";

describe("<ToggleTooltip /> index-filters/components/toogle-tooltip", () => {
  it("when is a phonetic search", () => {
    mountedFormComponent(<ToggleTooltip searchField="phonetic" searchFieldTooltips={["sample1", "sample2"]} />, {
      includeFormProvider: true
    });

    expect(screen.queryByText("navigation.phonetic_search.tooltip_label")).toBeInTheDocument();
    expect(screen.queryByText("sample1")).toBeInTheDocument();
    expect(screen.queryByText("sample2")).toBeInTheDocument();
  });

  it("when is a id search", () => {
    mountedFormComponent(<ToggleTooltip searchField="id_search" searchFieldTooltips={["sample3"]} />, {
      includeFormProvider: true
    });

    expect(screen.queryByText("navigation.id_search.tooltip_label")).toBeInTheDocument();
    expect(screen.queryByText("sample1")).not.toBeInTheDocument();
    expect(screen.queryByText("sample3")).toBeInTheDocument();
  });

  it("when is a phone search", () => {
    mountedFormComponent(<ToggleTooltip searchField="phone_number" searchFieldTooltips={["sample3"]} />, {
      includeFormProvider: true
    });

    expect(screen.queryByText("navigation.phone_number_search.tooltip_label")).toBeInTheDocument();
    expect(screen.queryByText("sample1")).not.toBeInTheDocument();
    expect(screen.queryByText("sample3")).toBeInTheDocument();
  });
});
