import { DATE_FIELD, NUMERIC_FIELD } from "../constants";

import valueParser from "./value-parser";

describe("valueParser()", () => {
  it("should return number for NUMERIC_FIELD", () => {
    expect(valueParser(NUMERIC_FIELD, "15")).to.eq(15);
  });

  it("should return null for an empty DATE_FIELD", () => {
    expect(valueParser(DATE_FIELD, "")).to.be.null;
  });
});
