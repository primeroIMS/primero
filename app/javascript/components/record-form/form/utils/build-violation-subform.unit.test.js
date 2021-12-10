import buildViolationSubform from "./build-violation-subform";

describe("buildViolationSubform", () => {
  it("should return empty object when formikValues and currentValues are empty", () => {
    const result = buildViolationSubform([], []);

    expect(result).to.deep.equal([]);
  });

  it("should return formikValues object when currentValues is empty", () => {
    const formikValues = [
      {
        id: 1,
        field: "test"
      }
    ];
    const result = buildViolationSubform(formikValues, []);

    expect(result).to.deep.equal(formikValues);
  });

  it("should return a object when formikValues currentValues are preenet", () => {
    const formikValues = [
      {
        unique_id: 1,
        field: "test"
      }
    ];
    const currentValues = [
      {
        unique_id: 2,
        field: "test2"
      }
    ];
    const result = buildViolationSubform(formikValues, currentValues);

    expect(result).to.deep.equal([...formikValues, ...currentValues]);
  });
});
