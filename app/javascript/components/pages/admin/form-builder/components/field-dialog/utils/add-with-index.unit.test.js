import addWithIndex from "./add-with-index";

describe("addWithIndex", () => {
  it("should add an element on an specific index array", () => {
    const original = ["a", "b", "c"];
    const expected = ["a", "b", "d", "c"];

    expect(addWithIndex(original, 2, "d")).to.deep.equals(expected);
  });
});
