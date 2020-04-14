import { touchedFormData } from "./touched-data";

describe("touchedFormData()", () => {
  it("returns touched data", () => {
    const data = {
      prop1: true,
      prop2: ["open"],
      prop3: "test",
      prop4: [{ prop4a: "prop-4a", prop4b: "prop-4b" }]
    };

    const expected = {
      prop1: true,
      prop2: ["open"],
      prop4: [{ prop4a: "prop-4a" }]
    };

    const touched = {
      prop1: true,
      prop2: true,
      prop4: [{ prop4a: true }]
    };

    expect(touchedFormData(touched, data)).to.deep.equal(expected);
  });
});
