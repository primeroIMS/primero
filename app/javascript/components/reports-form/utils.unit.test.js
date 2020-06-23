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
        "checkValue",
        "dependantFields",
        "formatAgeRange",
        "formatReport",
        "formattedFields",
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
          formSection: "testForm",
          option_strings_source: undefined,
          option_strings_text: undefined,
          tick_box_label: undefined,
          type: "date_field"
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
              type: "date_field",
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

  describe("formatReport()", () => {
    const report = {
      name: "test",
      description: null,
      fields: [
        {
          name: "test_1",
          position: {
            type: "horizontal"
          }
        },
        {
          name: "test_2",
          position: {
            type: "vertical"
          }
        }
      ]
    };

    it("should return empty string for description if report doesn't have one", () => {
      expect(utils.formatReport(report).description).to.be.empty;
    });

    it("should return aggregate_by key with an array of fields with 'horizontal' type ", () => {
      expect(utils.formatReport(report).aggregate_by).to.deep.equal(["test_1"]);
    });

    it("should return disaggregate_by key with an array of fields with 'horizontal' type ", () => {
      expect(utils.formatReport(report).disaggregate_by).to.deep.equal([
        "test_2"
      ]);
    });
  });

  describe("checkValue()", () => {
    it("should return a formatted date string", () => {
      const filter = {
        value: new Date("01/01/2020")
      };

      expect(utils.checkValue(filter)).to.be.equals("01-Jan-2020");
    });

    it("should return a string", () => {
      const filter = {
        value: "test"
      };

      expect(utils.checkValue(filter)).to.be.equals("test");
    });
  });
});
