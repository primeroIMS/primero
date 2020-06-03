import { fromJS, List } from "immutable";

import * as utils from "./utils";
import { REPORT_FIELD_TYPES } from "./constants";

describe("<IndexFilters /> - Utils", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...utils };

      [
        "buildFields",
        "buildReportFields",
        "dependantFields",
        "formatAgeRange",
        "getFormName"
      ].forEach(property => {
        expect(clone).to.have.property(property);
        expect(clone[property]).to.be.a("function");
        delete clone[property];
      });
      expect(clone).to.be.empty;
    });
  });

  describe("buildFields()", () => {
    it("returns data excluding some field types when isReportable is false", () => {
      const expected = [
        {
          id: "test_1",
          display_text: "Test 1",
          formSection: "testForm"
        }
      ];

      const values = List([
        {
          name: { en: "testForm" },
          fields: [
            {
              display_name: {
                en: "Test 1"
              },
              name: "test_1",
              type: "text_field",
              visible: true
            }
          ]
        }
      ]);

      expect(utils.buildFields(values, "en", false)).to.deep.equal(expected);
    });
  });

  describe("dependantFields()", () => {
    it("returns compacted object", () => {
      const expected = {
        aggregate_by: [],
        is_graph: false
      };

      const values = fromJS([
        {
          unique_id: "reports",
          fields: [
            {
              name: "name.en",
              type: "text_field"
            },
            {
              name: "is_graph",
              type: "tick_box"
            },
            {
              name: "aggregate_by",
              type: "select_box"
            }
          ]
        }
      ]);

      expect(utils.dependantFields(values)).to.deep.equal(expected);
    });
  });

  describe("formatAgeRange()", () => {
    it("returns formatted age range", () => {
      const expected = "0-5, 6-11, 12-17, 18+";

      const values = ["0..5", "6..11", "12..17", "18..999"];

      expect(utils.formatAgeRange(values)).to.deep.equal(expected);
    });
  });

  describe("getFormName()", () => {
    it("returns the form name if the selectedRecordType starts with the word reportable", () => {
      const expected = "services";

      expect(utils.getFormName("reportable_service")).to.deep.equal(expected);
    });

    it("returns empty string if the selectedRecordType does not starts with the word reportable", () => {
      expect(utils.getFormName("test")).to.be.empty;
    });
  });

  describe("buildReportFields()", () => {
    it("returns the form name if the selectedRecordType starts with the word reportable", () => {
      const expected = [
        {
          name: "test",
          position: {
            type: REPORT_FIELD_TYPES.horizontal,
            order: 0
          }
        }
      ];

      expect(
        utils.buildReportFields(["test"], REPORT_FIELD_TYPES.horizontal)
      ).to.deep.equal(expected);
    });
  });
});
