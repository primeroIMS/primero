import { fromJS, OrderedMap } from "immutable";

import { FieldRecord } from "../../record-form";

import * as utils from "./utils";

describe("ChangeLogs - Utils", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...utils };

      ["getFieldsAndValuesTranslations"].forEach(property => {
        expect(clone).to.have.property(property);
        expect(clone[property]).to.be.a("function");
        delete clone[property];
      });
      expect(clone).to.be.empty;
    });
  });

  describe("getFieldsAndValuesTranslations", () => {
    const fields = OrderedMap({
      0: FieldRecord({
        id: 1,
        name: "name_first",
        type: "text_field",
        editable: true,
        disabled: null,
        visible: true,
        display_name: {
          en: "First Name"
        },
        subform_section_id: null,
        help_text: {},
        multi_select: null,
        option_strings_source: null,
        option_strings_text: null,
        guiding_questions: "",
        required: true,
        date_validation: "default_date_validation"
      }),
      1: FieldRecord({
        id: 1,
        name: "nationality",
        type: "select_box",
        editable: true,
        disabled: null,
        visible: true,
        display_name: {
          en: "Nationality"
        },
        subform_section_id: null,
        help_text: {},
        multi_select: null,
        option_strings_source: "lookup lookup-country",
        option_strings_text: null,
        guiding_questions: "",
        required: true,
        date_validation: "default_date_validation"
      })
    });
    const lookups = fromJS([
      {
        id: 1,
        name: { en: "Nationality" },
        unique_id: "lookup-country",
        values: [
          { id: "australia", display_text: { en: "Australia" } },
          { id: "canada", display_text: { en: "Canada" } },
          { id: "india", display_text: { en: "India" } }
        ]
      },
      {
        id: 2,
        name: { en: "Yes or No" },
        unique_id: "lookup-yes-no",
        values: [
          { id: "true", display_text: { en: "Yes" } },
          { id: "false", display_text: { en: "No" } }
        ]
      }
    ]);
    const locations = fromJS([{ id: 1, code: "location-1", admin_level: 1 }]);

    const i18n = { t: item => item, locale: "en" };
    const field = "nationality";
    const value = { from: ["canada"], to: ["canada", "australia"] };

    const result = {
      fieldDisplayName: "Nationality",
      fieldValueFrom: ["Canada"],
      fieldValueTo: ["Canada", "Australia"]
    };

    it("should return object with field and values translated", () => {
      expect(
        utils.getFieldsAndValuesTranslations(
          fields,
          lookups,
          locations,
          i18n,
          field,
          value
        )
      ).to.deep.equal(result);
    });
  });
});
