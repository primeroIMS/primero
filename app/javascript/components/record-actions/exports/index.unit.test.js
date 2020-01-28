import { expect } from "chai";

import index from "./index";

describe("<RecordActions /> - exports/index", () => {
  const clone = { ...index };

  it("should have known properties", () => {
    expect(clone).to.be.an("object");
  });
});
