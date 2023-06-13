import { format } from "date-fns";

import translateQuarter from "./translate-quarter";

describe("translateQuarter", () => {
  it("translates the quarter", () => {
    const result = translateQuarter("Q3", format);

    expect(result).to.equal("Q3");
  });
});
