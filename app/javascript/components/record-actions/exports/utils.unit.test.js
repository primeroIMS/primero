import { fromJS, OrderedMap, Map } from "immutable";

import { fake } from "../../../test";
import { ACTIONS } from "../../../libs/permissions";
import { TEXT_FIELD, SUBFORM_SECTION } from "../../record-form/constants";
import { RECORD_PATH } from "../../../config/constants";

import { ALL_EXPORT_TYPES, EXPORT_FORMAT } from "./constants";
import * as utils from "./utils";

describe("<RecordActions /> - exports/utils", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...utils };

      [
        "allowedExports",
        "buildFields",
        "buildAgencyLogoPdfOptions",
        "exporterFilters",
        "formatFields",
        "formatFileName",
        "isCustomExport",
        "isPdfExport",
        "exportFormsOptions"
      ].forEach(property => {
        expect(clone).to.have.property(property);
        expect(clone[property]).to.be.a("function");
        delete clone[property];
      });
      expect(clone).to.be.empty;
    });
  });

  describe("allowedExports", () => {
    const i18n = {
      t: fake.returns("test.label")
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

      expect(utils.allowedExports(userPermission, i18n, false, RECORD_PATH.cases)).to.deep.equal(expected);
    });

    it("should return export types contained in userPermission", () => {
      const expected = [
        {
          id: "csv",
          display_name: "test.label",
          permission: ACTIONS.EXPORT_CSV,
          format: EXPORT_FORMAT.CSV,
          recordTypes: [RECORD_PATH.cases, RECORD_PATH.incidents, RECORD_PATH.tracing_requests]
        },
        {
          id: "json",
          display_name: "test.label",
          permission: ACTIONS.EXPORT_JSON,
          format: EXPORT_FORMAT.JSON,
          recordTypes: [RECORD_PATH.cases, RECORD_PATH.incidents, RECORD_PATH.tracing_requests]
        }
      ];

      const userPermission = fromJS([ACTIONS.EXPORT_CSV, ACTIONS.EXPORT_JSON]);

      expect(utils.allowedExports(userPermission, i18n, false, RECORD_PATH.cases)).to.deep.equal(expected);
    });
  });

  describe("formatFileName", () => {
    it("should set to default filename if any filename was not specified", () => {
      expect(utils.formatFileName("", "csv")).to.be.empty;
    });

    it("should not return labels if there are not translations", () => {
      const expected = "hello world.csv";

      expect(utils.formatFileName("hello world", "csv")).to.be.equal(expected);
    });
  });

  describe("exporterFilters", () => {
    const record = fromJS({
      record_state: true,
      sex: "female",
      date_of_birth: "2005-01-29",
      case_id: "1b21e684-c6b1-4e74-b148-317a2b575f47",
      created_at: "2020-01-29T21:57:00.274Z",
      name: "User 1",
      alert_count: 0,
      case_id_display: "b575f47",
      created_by: "primero_cp_ar",
      module_id: "primeromodule-cp",
      owned_by: "primero_cp",
      status: "open",
      registration_date: "2020-01-29",
      complete: true,
      type: "cases",
      id: "b342c488-578e-4f5c-85bc-35ece34cccdf",
      name_first: "User",
      short_id: "b575f47",
      age: 15,
      workflow: "new"
    });
    const appliedFilters = fromJS({
      sex: ["female"]
    });
    const shortIds = ["b575f47"];

    it("should return filters with short_id, if isShowPage true", () => {
      const expected = { filters: { short_id: shortIds } };

      expect(utils.exporterFilters(true, false, shortIds, appliedFilters, {}, record, false)).to.be.deep.equals(
        expected
      );
    });

    it("should return filters without page, per and total params", () => {
      const expected = { filters: { short_id: shortIds } };
      const filters = fromJS({
        sex: ["female"],
        page: 1,
        total: 40,
        per: 5
      });

      expect(utils.exporterFilters(true, false, shortIds, filters, {}, record, false)).to.be.deep.equals(expected);
    });

    it(
      "should return filters with short_id, " +
        "if isShowPage is false and allRowsSelected is false and there are not appliedFilters",
      () => {
        const expected = { filters: { short_id: shortIds } };

        expect(utils.exporterFilters(false, false, shortIds, fromJS({}), {}, record, false)).to.be.deep.equals(
          expected
        );
      }
    );

    it("should return and object with applied filters, if isShowPage is false and allRowsSelected is true", () => {
      const expected = { filters: { short_id: shortIds } };

      expect(utils.exporterFilters(false, true, shortIds, appliedFilters, {}, record, false)).to.be.deep.equals(
        expected
      );
    });

    it(
      "should return and object with short_id, and query " +
        "if isShowPage is false, allRowsSelected is false and a query is specified",
      () => {
        const query = "test";
        const expected = { filters: { short_id: shortIds } };

        expect(utils.exporterFilters(false, true, shortIds, fromJS({ query }), {}, record, false)).to.be.deep.equals(
          expected
        );
      }
    );

    it(
      "should return and object with applied filters and query, " +
        "if isShowPage is false, allRowsSelected is true and a query is specified",
      () => {
        const query = "test";
        const expected = { filters: { short_id: shortIds } };

        expect(utils.exporterFilters(false, true, shortIds, fromJS({ query }), {}, record, false)).to.be.deep.equals(
          expected
        );
      }
    );

    it("should return and object with default filter if allRecordsSelected are selected", () => {
      const expected = {
        filters: {
          status: ["open"],
          record_state: ["true"]
        }
      };

      expect(utils.exporterFilters(false, false, shortIds, fromJS({}), {}, record, true)).to.be.deep.equals(expected);
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

      expect(utils.buildFields(data, "en")).to.have.lengthOf(3);
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

      expect(utils.buildFields(data, "en")).to.be.deep.equals([]);
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

      expect(fields).to.have.lengthOf(1);
      expect(fields).to.be.deep.equals([
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

      expect(utils.formatFields(fields)).to.be.deep.equals(["field1", "field10"]);
    });
  });

  describe("isCustomExport", () => {
    it("returns false if not custom export", () => {
      expect(utils.isCustomExport("pdf")).to.be.false;
    });
    it("returns true if custom export", () => {
      expect(utils.isCustomExport("custom")).to.be.true;
    });
  });

  describe("isPdfExport", () => {
    it("returns false if not pdf export", () => {
      expect(utils.isPdfExport("custom")).to.be.false;
    });
    it("returns true if pdf export", () => {
      expect(utils.isPdfExport("pdf")).to.be.true;
    });
  });

  describe("buildAgencyLogoPdfOptions", () => {
    it("return empty array when argument is empty", () => {
      expect(utils.buildAgencyLogoPdfOptions([])).to.be.empty;
    });

    it("return an array of agencies", () => {
      const agencyLogosPdf = fromJS([{ id: "test", name: "Test" }]);
      const expected = [{ id: "test", display_name: "Test" }];

      expect(utils.buildAgencyLogoPdfOptions(agencyLogosPdf)).to.deep.equal(expected);
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

      expect(utils.exportFormsOptions(forms, "en")).to.deep.equal(expected);
    });
  });
});
