import * as helpers from "./utils";

describe("<ViolationTitle /> - utils", () => {
  describe("Verifying utils", () => {
    it("should have known utils", () => {
      const clonedHelpers = { ...helpers };

      ["getVerifiedValue"].forEach(property => {
        expect(clonedHelpers).to.have.property(property);
        delete clonedHelpers[property];
      });

      expect(clonedHelpers).to.deep.equal({});
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
        verified: "verification_found_that_incident_did_not_occur"
      };

      expect(helpers.getVerifiedValue(optionString, currentValues)).to.equal(
        "Verification found that incident did not occur"
      );
    });
  });
});
