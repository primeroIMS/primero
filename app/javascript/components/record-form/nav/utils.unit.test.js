import { OrderedMap } from "immutable";

import { NavRecord } from "../records";

import buildFormGroupData from "./utils";

describe("<Nav /> - utils", () => {
  describe("buildFormGroupData", () => {
    context("when is not a violation from", () => {
      it("return the form passed", () => {
        const formGroup = OrderedMap({
          1: NavRecord({
            id: 1,
            unique_id: "cp_incident_record_owner",
            parent_form: "incident",
            name: { en: "Form name" },
            group: "incident",
            fields: []
          })
        });

        expect(buildFormGroupData(formGroup)).to.deep.equal(formGroup);
      });
    });
    context("when is a violation from", () => {
      it("return the violation from", () => {
        const formGroup = OrderedMap({
          1: NavRecord({
            id: 5,
            unique_id: "violation_form_test",
            parent_form: "incident",
            name: { en: "Form name" },
            group: "violations",
            formId: "killing_violation_wrapper",
            fields: []
          })
        });

        expect(buildFormGroupData(formGroup).first().formId).to.be.equal("killing_violation_wrapper");
        expect(buildFormGroupData(formGroup).size).to.be.equal(8);
      });
    });
  });
});
