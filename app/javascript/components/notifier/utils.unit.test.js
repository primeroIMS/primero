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

    context("when no message is passed", () => {
      beforeEach(() => {
        stub(uuid, "v4").returns("dd3b8e93-0cce-415b-ad2b-d06bb454b66f");
      });

      afterEach(() => {
        uuid.v4.restore();
      });

      it("should return generated key", () => {
        const expected = "d06bb454b66f";

        expect(utils.generate.messageKey(null, false)).to.equal(expected);
      });
    });
  });
});
