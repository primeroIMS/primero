// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedFormComponent, screen } from "../../../../test-utils";

import Search from "./search";

describe("<Search /> index-filters/components/filter-types/search", () => {
  const props = {
    recordType: "cases"
  };

  it("renders IconButton", () => {
    mountedFormComponent(<Search {...props} />, { includeFormProvider: true });

    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("renders InputBase", () => {
    mountedFormComponent(<Search {...props} />, { includeFormProvider: true });

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
