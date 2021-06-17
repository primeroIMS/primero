import formatAgeRange from "./format-age-range";

describe("<ReportForm>/utils/formatAgeRange()", () => {
  it("returns formatted age range", () => {
    const expected = "0-5, 6-11, 12-17, 18+";

    const values = ["0..5", "6..11", "12..17", "18..999"];

    expect(formatAgeRange(values)).to.deep.equal(expected);
  });
});
