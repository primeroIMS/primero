import getCellValue from "./get-cell-value";

describe("getCellValue", () => {
  it("returns a numeric value for a cell wrapped in a react component", () => {
    expect(
      getCellValue(
        <div>
          <span>5</span>
        </div>
      )
    ).to.eq(5);
  });

  it("returns a numeric value for a cell", () => {
    expect(getCellValue("5")).to.eq(5);
  });
});
