// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import * as helpers from "./utils";

describe("<ViolationTitle /> - utils", () => {
  describe("Verifying utils", () => {
    it("should have known utils", () => {
      const clonedHelpers = { ...helpers };

      ["getVerifiedValue"].forEach(property => {
        expect(clonedHelpers).toHaveProperty(property);
        delete clonedHelpers[property];
      });

      expect(clonedHelpers).toEqual({});
    });
  });

  describe("getVerifiedValue", () => {
    it("should return false if it is not the traces subform", () => {
      const optionString = [
        {
          id: "verified",
          display_text: "Verified"
        },
        {
          id: "report_pending_verification",
          display_text: "Report pending verification"
        },
        {
          id: "not_mrm",
          display_text: "Not MRM"
        },
        {
          id: "verification_found_that_incident_did_not_occur",
          display_text: "Verification found that incident did not occur"
        }
      ];
      const currentValues = {
        unique_id: "ab123cde",
        relation_name: "this is a relation",
        ctfmr_verified: "verification_found_that_incident_did_not_occur"
      };

      expect(helpers.getVerifiedValue(optionString, currentValues)).toBe(
        "Verification found that incident did not occur"
      );
    });
  });
});
