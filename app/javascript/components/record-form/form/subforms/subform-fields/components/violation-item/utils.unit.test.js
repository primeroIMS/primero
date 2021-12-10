import { FieldRecord } from "../../../../../records";

import * as helpers from "./utils";

describe("<ViolationItem /> - utils", () => {
  describe("Verifying utils", () => {
    it("should have known utils", () => {
      const clonedHelpers = { ...helpers };

      ["getViolationTallyLabel"].forEach(property => {
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

    it("should return a short violation values as label", () => {
      expect(helpers.getViolationTallyLabel(fields, currentValues, locale)).to.deep.equal(
        "violation count: boys: (1) girls: (2)"
      );
    });

    it("should return null if violation tally is not present", () => {
      expect(helpers.getViolationTallyLabel(fields.slice(0, 3), currentValues, locale)).to.equal(null);
    });
  });
});
