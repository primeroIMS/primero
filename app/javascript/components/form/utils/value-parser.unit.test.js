import { NUMERIC_FIELD } from "../constants";

import valueParser from "./value-parser";

describe("valueParser()", () => {
  it("should return number for NUMERIC_FIELD", () => {
    expect(valueParser(NUMERIC_FIELD, "15")).to.eq(15);
  });
});
