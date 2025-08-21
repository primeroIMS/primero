// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedFormComponent, screen } from "../../../../test-utils";

import PhoneticHelpText from "./component";

describe("<SearchBox /> index-filters/components/search-box", () => {
  it("renders IconButton", () => {
    mountedFormComponent(<PhoneticHelpText />, { includeFormProvider: true });

    expect(screen.queryByText("navigation.phonetic_search.help_text")).toBeInTheDocument();
  });

  it("renders InputBase", () => {
    mountedFormComponent(<PhoneticHelpText isPhonetic={false} />, { includeFormProvider: true });

    expect(screen.queryByText("navigation.id_search.help_text")).toBeInTheDocument();
  });
});
