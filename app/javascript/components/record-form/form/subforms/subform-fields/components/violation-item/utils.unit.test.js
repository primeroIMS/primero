import { FieldRecord } from "../../../../../records";

import * as helpers from "./utils";

describe("Verifying utils", () => {
  it("should have known utils", () => {
    const clonedHelpers = { ...helpers };

    ["getViolationTallyLabel", "getShortUniqueId", "getVerifiedValue"].forEach(property => {
      expect(clonedHelpers).to.have.property(property);
      delete clonedHelpers[property];
    });

    expect(clonedHelpers).to.deep.equal({});
  });
});

describe("getViolationTallyLabel", () => {
  const fields = [
    FieldRecord({
      name: "relation_name",
      visible: true,
      type: "text_field"
    }),
    FieldRecord({
      name: "relation_child_is_in_contact",
      visible: true,
      type: "text_field"
    }),
    FieldRecord({
      name: "verified",
      visible: true,
      type: "text_field",
      option_strings_source: "lookup lookup-status"
    }),
    FieldRecord({
      name: "violation_tally",
      visible: true,
      type: "tally_field",
      display_name: { en: "violation count" }
    })
  ];
  const currentValues = {
    unique_id: "ab123cde",
    relation_name: "this is a relation",
    violation_tally: { boys: 1, girls: 2, unknow: 0, total: 3 }
  };
  const locale = "en";

  it("should return a short uniqueId if unique_id is present", () => {
    expect(helpers.getViolationTallyLabel(fields, currentValues, locale)).to.deep.equal(
      "violation count: boys: (1) girls: (2)"
    );
  });
});

describe("getShortUniqueId", () => {
  it("should return a short uniqueId if unique_id is present", () => {
    expect(helpers.getShortUniqueId({ unique_id: "ab123cde" })).to.equal("ab123");
  });

  it("should return a null if unique_id is NOT present", () => {
    expect(helpers.getShortUniqueId({})).to.equal(null);
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
