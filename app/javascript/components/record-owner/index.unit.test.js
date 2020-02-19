import { expect } from "chai";

import index from "./index";

describe("<RecordOwner /> - index", () => {
  const indexValues = { ...index };

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
  });
});
