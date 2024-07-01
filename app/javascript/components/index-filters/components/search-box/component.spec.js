// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedFormComponent, screen } from "../../../../test-utils";

import SearchBox from "./component";

describe("<SearchBox /> index-filters/components/search-box", () => {
  const props = {
    recordType: "cases"
  };

  it("renders IconButton", () => {
    mountedFormComponent(<SearchBox {...props} />, { includeFormProvider: true });

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("renders InputBase", () => {
    mountedFormComponent(<SearchBox {...props} />, { includeFormProvider: true });

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
