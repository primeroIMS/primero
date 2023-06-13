import formatAgeRange from "./format-age-range";

describe("formatAgeRange", () => {
  it("formats the age ranges", () => {
    const range = formatAgeRange('0..9');

    expect(range).to.equal("0 - 9");
  });
});
