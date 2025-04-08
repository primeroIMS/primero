// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, OrderedMap, Map } from "immutable";

import { ACTIONS } from "../../permissions";
import { TEXT_FIELD, SUBFORM_SECTION } from "../../record-form/constants";
import { RECORD_PATH } from "../../../config";

import { ALL_EXPORT_TYPES, EXPORT_FORMAT } from "./constants";
import * as utils from "./utils";

describe("<RecordActions /> - exports/utils", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...utils };

      [
        "allowedExports",
        "buildAgencyLogoPdfOptions",
        "buildFields",
        "exportFormsOptions",
        "formatFields",
        "formatFileName",
        "isCustomExport",
        "isPdfExport",
        "skipFilters"
      ].forEach(property => {
        expect(clone).toHaveProperty(property);
        expect(clone[property]).toBeInstanceOf(Function);
        delete clone[property];
      });
      expect(Object.keys(clone)).toHaveLength(0);
    });
  });

  describe("allowedExports", () => {
    const i18n = {
      t: jest.fn().mockReturnValue("test.label")
    };

    it("should return all export types if userPermission contains manage permission and recordType is cases", () => {
      const userPermission = fromJS(["manage"]);

      const expected = ALL_EXPORT_TYPES.filter(
        exportType => exportType.recordTypes.includes(RECORD_PATH.cases) && !exportType.hideOnShowPage
      ).map(a => {
        return {
          ...a,
          display_name: "test.label"
        };
      });

      expect(utils.allowedExports(userPermission, i18n, false, RECORD_PATH.cases)).toEqual(expected);
    });

    it("should return export types contained in userPermission", () => {
      const expected = [
        {
          id: "csv",
          display_name: "test.label",
          permission: ACTIONS.EXPORT_CSV,
          format: EXPORT_FORMAT.CSV,
          recordTypes: [
            RECORD_PATH.cases,
            RECORD_PATH.incidents,
            RECORD_PATH.tracing_requests,
            RECORD_PATH.registry_records,
            RECORD_PATH.families
          ]
        },
        {
          id: "json",
          display_name: "test.label",
          permission: ACTIONS.EXPORT_JSON,
          format: EXPORT_FORMAT.JSON,
          recordTypes: [RECORD_PATH.cases, RECORD_PATH.incidents, RECORD_PATH.tracing_requests, RECORD_PATH.families]
        }
      ];

      const userPermission = fromJS([ACTIONS.EXPORT_CSV, ACTIONS.EXPORT_JSON]);

      expect(utils.allowedExports(userPermission, i18n, false, RECORD_PATH.cases)).toEqual(expected);
    });
  });

  describe("formatFileName", () => {
    it("should set to default filename if any filename was not specified", () => {
      expect(utils.formatFileName("", "csv")).toHaveLength(0);
    });

    it("should not return labels if there are not translations", () => {
      const expected = "hello world.csv";

      expect(utils.formatFileName("hello world", "csv")).toBe(expected);
    });
  });

  describe("buildFields", () => {
    it("should return fields from forms and subforms when individual fields is false", () => {
      const data = [
        {
          unique_id: "test_form",
          name: {
            en: "Test Form"
          },
          fields: [
            {
              name: "field_form",
              display_name: { en: "Field Form" },
              type: TEXT_FIELD,
              visible: true
            }
          ]
        },
        {
          unique_id: "test_subform",
          name: {
            en: "Test Subform"
          },
          fields: [
            {
              name: "field_subform",
              display_name: { en: "Field Subform" },
              type: SUBFORM_SECTION,
              visible: true,
              subform_section_id: {
                unique_id: "field_subform_section",
                name: {
                  en: "Field Subform Section"
                },
                fields: [
                  {
                    name: "field_subform_section_test",
                    display_name: { en: "Field from Subform" },
                    type: TEXT_FIELD,
                    visible: true
                  },
                  {
                    name: "field_subform_section_test1",
                    display_name: { en: "Field from Subform 1" },
                    type: TEXT_FIELD,
                    visible: true
                  }
                ]
              }
            }
          ]
        }
      ];

      expect(utils.buildFields(data, "en")).toHaveLength(3);
    });

    it("does not fail subforms without a subform section id", () => {
      const data = [
        {
          unique_id: "test_subform",
          name: {
            en: "Test Subform"
          },
          fields: [
            {
              name: "field_subform",
              display_name: { en: "Field Subform" },
              type: SUBFORM_SECTION,
              visible: true,
              subform_section_id: null
            }
          ]
        }
      ];

      expect(utils.buildFields(data, "en")).toEqual([]);
    });

    it("should not return hide_on_view_page: true fields", () => {
      const data = [
        {
          unique_id: "test_form",
          name: {
            en: "Test Form"
          },
          fields: [
            {
              name: "field_1",
              display_name: { en: "Field 1" },
              type: TEXT_FIELD,
              visible: true
            },
            {
              name: "field_2",
              display_name: { en: "Field 2" },
              type: TEXT_FIELD,
              visible: true,
              hide_on_view_page: true
            }
          ]
        }
      ];

      const fields = utils.buildFields(data, "en");

      expect(fields).toHaveLength(1);
      expect(fields).toEqual([
        {
          display_text: "Field 1",
          formSectionId: "test_form",
          formSectionName: "Test Form",
          id: "test_form:field_1",
          visible: true
        }
      ]);
    });
  });

  describe("formatFields", () => {
    it("should return an array of strings with field_names", () => {
      const fields = ["form1:field1", "form2:field1", "form3:field10"];

      expect(utils.formatFields(fields)).toEqual(["field1", "field10"]);
    });
  });

  describe("isCustomExport", () => {
    it("returns false if not custom export", () => {
      expect(utils.isCustomExport("pdf")).toBe(false);
    });
    it("returns true if custom export", () => {
      expect(utils.isCustomExport("custom")).toBe(true);
    });
  });

  describe("isPdfExport", () => {
    it("returns false if not pdf export", () => {
      expect(utils.isPdfExport("custom")).toBe(false);
    });
    it("returns true if pdf export", () => {
      expect(utils.isPdfExport("pdf")).toBe(true);
    });
  });

  describe("buildAgencyLogoPdfOptions", () => {
    it("return empty array when argument is empty", () => {
      expect(utils.buildAgencyLogoPdfOptions([])).toHaveLength(0);
    });

    it("return an array of agencies", () => {
      const agencyLogosPdf = fromJS([{ id: "test", name: "Test" }]);
      const expected = [{ id: "test", display_name: "Test" }];

      expect(utils.buildAgencyLogoPdfOptions(agencyLogosPdf)).toEqual(expected);
    });
  });

  describe("exportFormsOptions", () => {
    it("return an objects of forms", () => {
      const forms = OrderedMap({
        0: Map({ unique_id: "test", name: { en: "Test" }, visible: true, is_nested: false }),
        1: Map({ unique_id: "test2", name: { en: "Test2" }, visible: false, is_nested: false }),
        2: Map({ unique_id: "test3", name: { en: "Test3" }, visible: true, is_nested: true })
      });
      const expected = [{ id: "test", display_text: "Test" }];

      expect(utils.exportFormsOptions(forms, "en")).toEqual(expected);
    });
  });

  describe("skipFilters", () => {
    it("removes the FILTERS_TO_SKIP", () => {
      expect(utils.skipFilters({ param1: "value1", per: 5, page: 1 })).toEqual({ param1: "value1" });
    });
  });
});
