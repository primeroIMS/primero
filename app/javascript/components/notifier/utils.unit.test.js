// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import uuid from "../../libs/uuid";

import * as utils from "./utils";

describe("components/notifier/utils.js", () => {
  describe("generate()", () => {
    it("should kebab case a message", () => {
      const expected = "this-is-a-test";

      expect(utils.generate.messageKey("This is a test")).toBe(expected);
    });

    it("should return message as is if isMessageKey", () => {
      const expected = "this-is-a-test";

      expect(utils.generate.messageKey("this-is-a-test", true)).toBe(expected);
    });

    describe("when no message is passed", () => {
      beforeEach(() => {
        jest.spyOn(uuid, "v4").mockReturnValue("dd3b8e93-0cce-415b-ad2b-d06bb454b66f");
      });

      afterEach(() => {
        jest.resetAllMocks();
      });

      it("should return generated key", () => {
        const expected = "d06bb454b66f";

        expect(utils.generate.messageKey(null, false)).toBe(expected);
      });
    });
  });
});
