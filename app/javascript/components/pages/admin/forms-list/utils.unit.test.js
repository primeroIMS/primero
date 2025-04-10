// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { FormSectionRecord } from "../../../record-form/records";

import { DRAGGING_COLOR } from "./constants";
import * as utils from "./utils";

describe("<FormsList /> - Utils", () => {
  describe("getItemStyle", () => {
    it("should return the correct object", () => {
      const expected = {
        userSelect: "none",
        background: DRAGGING_COLOR
      };

      expect(utils.getItemStyle(true, {})).toEqual(expected);
    });
  });

  describe("getListStyle", () => {
    it("should return the correct object", () => {
      const expected = { background: DRAGGING_COLOR };

      expect(utils.getListStyle(true)).toEqual(expected);
    });
  });

  describe("buildOrderUpdater", () => {
    it("should return a function that updates the order of a element", () => {
      const expected = fromJS({ order_form_group: 0 });
      const current = 0;
      const newOrder = 20;

      const updater = utils.buildOrderUpdater(current, newOrder);

      expect(updater(fromJS({ order_form_group: 10 }))).toEqual(expected);
    });
  });

  describe("reorderElems", () => {
    it("should return the correct object", () => {
      const formSections = fromJS([
        { unique_id: "form_1", order: 0, id: 1 },
        { unique_id: "form_2", order: 10, id: 2 }
      ]);

      const reorderedForms = utils.reorderElems({
        fieldsMeta: {
          idField: "unique_id",
          keyField: "id",
          orderField: "order"
        },
        orderMeta: {
          step: 10,
          target: 10
        },
        elemId: "form_1",
        elems: formSections
      });

      const expected = fromJS({
        1: { unique_id: "form_1", order: 10, id: 1 },
        2: { unique_id: "form_2", order: 0, id: 2 }
      });

      expect(reorderedForms).toEqual(expected);
    });
  });

  describe("formSectionFilter", () => {
    it("should return true if form section matches the filter", () => {
      const formSection = FormSectionRecord({
        unique_id: "form_section_1",
        is_nested: false,
        parent_form: "parent",
        module_ids: ["module_1"]
      });

      const filter = { primeroModule: "module_1", recordType: "parent" };

      expect(utils.formSectionFilter(formSection, filter)).toBe(true);
    });
  });

  describe("getFormGroupId", () => {
    it("should return the correct formGroupId", () => {
      const formSections = fromJS([
        FormSectionRecord({
          unique_id: "form_1",
          form_group_id: "group_1"
        }),
        FormSectionRecord({
          unique_id: "form_2",
          form_group_id: "group_2"
        })
      ]);

      expect(utils.getFormGroupId(formSections, "form_1")).toBe("group_1");
    });
  });

  describe("filterFormSections", () => {
    it("should return the form sections that matches the filter", () => {
      const formSection1 = FormSectionRecord({
        unique_id: "form_1",
        form_group_id: "group_1",
        parent_form: "parent_1",
        module_ids: ["module_1"]
      });
      const formSection2 = FormSectionRecord({
        unique_id: "form_2",
        form_group_id: "group_2",
        parent_form: "parent_2",
        module_ids: ["module_1"]
      });
      const formSections = fromJS([formSection1, formSection2]);

      const expected = fromJS([formSection2]);

      const filter = { primeroModule: "module_1", recordType: "parent_2" };

      expect(utils.filterFormSections(formSections, filter)).toEqual(expected);
    });
  });

  describe("groupByFormGroup", () => {
    const formSection1 = FormSectionRecord({
      unique_id: "form_1",
      form_group_id: "group_1",
      parent_form: "parent_1",
      module_ids: ["module_1"]
    });
    const formSection2 = FormSectionRecord({
      unique_id: "form_2",
      form_group_id: "group_2",
      parent_form: "parent_1",
      module_ids: ["module_1"]
    });

    const formSectionsByGroup = utils.groupByFormGroup(fromJS([formSection1, formSection2]));

    expect(formSectionsByGroup.keySeq().toJS()).toEqual(["group_1", "group_2"]);
  });

  describe("setInitialFormOrder", () => {
    it("should return the correct order", () => {
      const formSection1 = {
        unique_id: "form_1",
        form_group_id: "group_1",
        parent_form: "parent_1",
        module_ids: ["module_1"]
      };

      const formSection2 = {
        unique_id: "form_2",
        form_group_id: "group_1",
        parent_form: "parent_1",
        module_ids: ["module_1"]
      };

      const formSections = fromJS([FormSectionRecord({ ...formSection1 }), FormSectionRecord({ ...formSection2 })]);

      const expected = fromJS([
        FormSectionRecord({ ...formSection1, order: 0 }),
        FormSectionRecord({ ...formSection2, order: 10 })
      ]);

      const filter = { primeroModule: "module_1", recordType: "parent_1" };

      expect(
        utils
          .setInitialFormOrder(formSections, filter)
          .map(formSection => fromJS([formSection.unique_id, formSection.order]))
          .equals(expected.map(formSection => fromJS([formSection.unique_id, formSection.order])))
      ).toBe(true);
    });
  });

  describe("setInitialGroupOrder", () => {
    it("should return the correct order", () => {
      const formSection1 = {
        unique_id: "form_1",
        form_group_id: "group_1",
        parent_form: "parent_1",
        module_ids: ["module_1"]
      };

      const formSection2 = {
        unique_id: "form_2",
        form_group_id: "group_2",
        parent_form: "parent_1",
        module_ids: ["module_1"]
      };

      const formSections = fromJS([FormSectionRecord({ ...formSection1 }), FormSectionRecord({ ...formSection2 })]);

      const expected = fromJS([
        FormSectionRecord({ ...formSection1, order_form_group: 0 }),
        FormSectionRecord({ ...formSection2, order_form_group: 10 })
      ]);

      const filter = { primeroModule: "module_1", recordType: "parent_1" };

      expect(
        utils
          .setInitialGroupOrder(formSections, filter)
          .map(formSection => fromJS([formSection.unique_id, formSection.order_form_group]))
          .equals(expected.map(formSection => fromJS([formSection.unique_id, formSection.order_form_group])))
      ).toBe(true);
    });
  });

  describe("getFormGroups", () => {
    it("should return the correct FormGroups", () => {
      const allFormGroupsLookups = [
        {
          id: 51,
          unique_id: "lookup-form-group-cp-case",
          name: {
            en: "Form Groups - CP Case"
          },
          values: [
            {
              id: "identification_registration",
              disabled: false,
              display_text: "Identification / Registration"
            },
            {
              id: "family_partner_details",
              disabled: false,
              display_text: "Family / Partner Details"
            },
            {
              id: "record_information",
              disabled: false,
              display_text: "Record Information"
            }
          ]
        }
      ];

      const result = {
        identification_registration: "Identification / Registration",
        family_partner_details: "Family / Partner Details",
        record_information: "Record Information"
      };

      expect(utils.getFormGroups(allFormGroupsLookups, "primeromodule-cp", "case", { locale: "en" })).toEqual(result);
    });
  });
});
