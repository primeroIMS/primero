// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import withStickyOption from "./with-sticky-option";

describe("withStickyOption", () => {
  const options = [
    { id: "option_1", display_text: "Option 1" },
    { id: "option_2", display_text: "Option 2" },
    { id: "option_3", display_text: "Option 3", disabled: true }
  ];

  it("should append a disabled option if sticky", () => {
    expect(withStickyOption(options, "option_3")).toHaveLength(3);
  });

  it("should not append a disabled option if it is not sticky", () => {
    expect(withStickyOption(options)).toHaveLength(2);
  });
});
