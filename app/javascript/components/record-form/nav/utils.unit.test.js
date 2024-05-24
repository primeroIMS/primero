// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
        expect(buildFormGroupData(formGroup).size).to.be.equal(1);
      });
    });
    context("when display_conditions exists", () => {
      it("return the forms depends of condition", () => {
        const formGroup = OrderedMap({
          1: NavRecord({
            id: 1,
            unique_id: "violation_form_test",
            parent_form: "incident",
            name: { en: "Form name" },
            group: "violations",
            formId: "killing_violation_wrapper",
            fields: [],
            display_conditions: {
              in: {
                test_field: ["killing"]
              }
            }
          }),
          2: NavRecord({
            id: 2,
            unique_id: "violation_form_test",
            parent_form: "incident",
            name: { en: "Form name" },
            group: "violations",
            formId: "other_form",
            fields: []
          }),
          3: NavRecord({
            id: 3,
            unique_id: "violation_form_test2",
            parent_form: "incident",
            name: { en: "Form name" },
            group: "violations",
            formId: "maiming_violation_wrapper",
            fields: [],
            display_conditions: {
              in: {
                test_field: ["another_value"]
              }
            }
          })
        });

        const values = {
          test_field: ["killing"]
        };

        const [...forms] = buildFormGroupData(formGroup, values).values();

        expect(forms.map(fs => fs.formId)).to.deep.equal(["killing_violation_wrapper", "other_form"]);
        expect(buildFormGroupData(formGroup, values).size).to.be.equal(2);
      });
    });
  });
});
