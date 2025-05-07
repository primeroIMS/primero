// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as utils from "./utils";

describe("components/transitions/referrals/utils.js", () => {
  describe("with methods", () => {
    it("should have known methods", () => {
      const clone = { ...utils };

      ["referralAgencyName"].forEach(property => {
        expect(clone).toHaveProperty(property);
        expect(clone[property]).toBeInstanceOf(Function);
        delete clone[property];
      });
      expect(Object.keys(clone)).toHaveLength(0);
    });
  });

  describe("referralAgencyName", () => {
    const agencies = [
      {
        id: "test-1",
        display_text: "Test 1"
      }
    ];

    describe("when is not a remote transition", () => {
      const transition = {
        remote: false,
        transitioned_to_agency: "test-1"
      };

      it("should return the agency name from agencies ", () => {
        expect(utils.referralAgencyName(transition, agencies)).toBe("Test 1");
      });
    });

    describe("when is a remote transition", () => {
      const transition = {
        remote: true,
        transitioned_to_agency: "Test Agency"
      };

      it("should return the agency name from transition's object ", () => {
        expect(utils.referralAgencyName(transition, agencies)).toBe("Test Agency");
      });
    });
  });
});
