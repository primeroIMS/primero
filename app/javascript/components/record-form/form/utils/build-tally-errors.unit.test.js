import buildTallyErrors from "./build-tally-errors";

describe("buildTallyErrors", () => {
  it("should return and array of errors for tallyFields", () => {
    const result = buildTallyErrors({ unknown: "This is an error in unknown", boys: "This is an error in boys" });

    expect(result).to.deep.equal(["This is an error in unknown", "This is an error in boys"]);
  });
});
