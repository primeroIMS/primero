import { selectAllRecords } from "./utils";

describe("<CustomToolbarSelect /> - utils", () => {
  it("should return an object with all records selected", () => {
    const totalRecords = 17;
    const perPage = 5;
    const expected = {
      0: [0, 1, 2, 3, 4],
      1: [0, 1, 2, 3, 4],
      2: [0, 1, 2, 3, 4],
      3: [0, 1]
    };

    expect(selectAllRecords(totalRecords, perPage)).to.be.deep.equals(expected);
  });
});
