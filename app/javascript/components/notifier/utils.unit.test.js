import uuid from "uuid";

import { stub } from "../../test";

import * as utils from "./utils";

describe("components/notifier/utils.js", () => {
  describe("generate()", () => {
    it("should kebab case a message", () => {
      const expected = "this-is-a-test";

      expect(utils.generate.messageKey("This is a test")).to.equal(expected);
    });

    it("should return message as is if isMessageKey", () => {
      const expected = "this-is-a-test";

      expect(utils.generate.messageKey("this-is-a-test", true)).to.equal(expected);
    });

    it("should return generated key if no message", () => {
      const expected = "d06bb454b66f";

      stub(uuid, "v4").returns("b8e93-0cce-415b-ad2b-d06bb454b66f");
      expect(utils.generate.messageKey(null, false)).to.equal(expected);

      uuid.v4.restore();
    });
  });
});
