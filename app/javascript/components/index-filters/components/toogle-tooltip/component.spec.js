// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedFormComponent, screen } from "../../../../test-utils";

import SearchBox from "./component";

describe("<SearchBox /> index-filters/components/toogle-tooltip", () => {
  it("when isPhonetic", () => {
    mountedFormComponent(<SearchBox isPhonetic searchFieldTooltips={["sample1", "sample2"]} />, {
      includeFormProvider: true
    });

    expect(screen.queryByText("navigation.phonetic_search.tooltip_label")).toBeInTheDocument();
    expect(screen.queryByText("sample1")).toBeInTheDocument();
    expect(screen.queryByText("sample2")).toBeInTheDocument();
  });

  it("when isPhonetic is false", () => {
    mountedFormComponent(<SearchBox isPhonetic={false} searchFieldTooltips={["sample3"]} />, {
      includeFormProvider: true
    });

    expect(screen.queryByText("navigation.id_search.tooltip_label")).toBeInTheDocument();
    expect(screen.queryByText("sample1")).not.toBeInTheDocument();
    expect(screen.queryByText("sample3")).toBeInTheDocument();
  });
});
