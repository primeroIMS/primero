import uuid from "uuid";

import { stub } from "../test";

import toIdentifier from "./to-identifier";

describe("toIdentifier", () => {
  const identifier = "1234abc";

  beforeEach(() => {
    stub(uuid, "v4").returns("1234abc");
  });

  afterEach(() => {
    uuid.v4.restore();
  });

  it("should return the id with identifier if id is not a falsy value", () => {
    const id = "efg";
    const expected = `${id}_${identifier}`;

    expect(toIdentifier(id)).to.be.equal(expected);
  });

  it("should only return the identifier if id is a falsy value", () => {
    expect(toIdentifier()).to.be.equal(identifier);
  });
});
