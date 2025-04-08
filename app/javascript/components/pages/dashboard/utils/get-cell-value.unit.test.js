// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getCellValue from "./get-cell-value";

describe("getCellValue", () => {
  it("returns a numeric value for a cell wrapped in a react component", () => {
    expect(
      getCellValue(
        <div>
          <span>5</span>
        </div>
      )
    ).toBe(5);
  });

  it("returns a numeric value for a cell", () => {
    expect(getCellValue("5")).toBe(5);
  });
});
