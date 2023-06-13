import { format } from "date-fns";

import translateMonth from "./translate-month";

describe("translateMonth", () => {
  it("translates the month", () => {
    const result = translateMonth("03", format);

    expect(result).to.equal("Mar");
  });
});
