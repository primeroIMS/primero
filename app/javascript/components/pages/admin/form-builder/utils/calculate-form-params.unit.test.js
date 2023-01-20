import { fromJS } from "immutable";

import { SAVE_METHODS } from "../../../../../config";

import calculateFormParams from "./calculate-form-params";

describe("calculateFormParams", () => {
  describe("when subform is present", () => {
    it("should return form object with body", () => {
      const expected = {
        id: 5,
        saveMethod: SAVE_METHODS.update,
        body: {
          data: {
            subform_test_c5d3e6c: {
              name: "subform_test_c5d3e6c",
              hide_on_view_page: false,
              visible: true,
              mobile_visible: true,
              type: "subform",
              disabled: false,
              skip_logic: false,
              subform_section_configuration: {},
              order: 52,
              multi_select: false,
              date_include_time: false,
              subform_section_temp_id: 54780,
              subform_section_unique_id: "subform_test_c5d3e6c",
              display_conditions_record: {},
              display_name: {
                en: "subform test"
              }
            }
          }
        },
        message: "forms.messages.updated"
      };

      expect(
        calculateFormParams({
          id: 5,
          formData: {
            subform_test_c5d3e6c: {
              name: "subform_test_c5d3e6c",
              hide_on_view_page: false,
              visible: true,
              mobile_visible: true,
              type: "subform",
              disabled: false,
              skip_logic: false,
              subform_section_configuration: {},
              order: 52,
              multi_select: false,
              date_include_time: false,
              subform_section_temp_id: 54780,
              subform_section_unique_id: "subform_test_c5d3e6c",
              display_conditions_record: {},
              display_name: {
                en: "subform test"
              }
            }
          },
          dirtyFields: {
            fields: {
              subform_test_c5d3e6c: {
                hide_on_view_page: true,
                name: true,
                visible: true,
                mobile_visible: true,
                type: true,
                disabled: true,
                skip_logic: true,
                order: true,
                multi_select: true,
                date_include_time: true,
                subform_section_temp_id: true,
                subform_section_unique_id: true,
                display_name: {
                  en: true
                }
              }
            }
          },
          formMode: fromJS({
            isShow: false,
            isEdit: true,
            isNew: false,
            isDialog: false
          }),
          i18n: { t: t => t }
        })
      ).to.deep.equal(expected);
    });
  });

  describe("when skip_logic is true but display conditions is empty", () => {
    it("should return form object with body", () => {
      const expected = {
        id: 5,
        saveMethod: SAVE_METHODS.update,
        body: {
          data: {
            description: {
              en: "Test"
            },
            skip_logic: false,
            display_conditions: {}
          }
        },
        message: "forms.messages.updated"
      };

      expect(
        calculateFormParams({
          id: 5,
          formData: {
            description: {
              en: "Test"
            },
            skip_logic: false
          },
          dirtyFields: {
            description: {
              en: true
            },
            skip_logic: true
          },
          formMode: fromJS({
            isShow: false,
            isEdit: true,
            isNew: false,
            isDialog: false
          }),
          i18n: { t: t => t }
        })
      ).to.deep.equal(expected);
    });
  });

  describe("when skip_logic is true and display conditions is present", () => {
    it("should return form object with body", () => {
      const expected = {
        id: 5,
        saveMethod: SAVE_METHODS.update,
        body: {
          data: {
            description: {
              en: "Test"
            },
            skip_logic: true,
            display_conditions: {
              in: {
                bia_approved: [true]
              }
            }
          }
        },
        message: "forms.messages.updated"
      };

      expect(
        calculateFormParams({
          id: 5,
          formData: {
            description: {
              en: "Test"
            },
            skip_logic: true,
            display_conditions: [
              {
                value: [true],
                attribute: "bia_approved"
              }
            ]
          },
          dirtyFields: {
            description: {
              en: true
            },
            skip_logic: true,
            display_conditions: [
              {
                attribute: true
              }
            ]
          },
          formMode: fromJS({
            isShow: false,
            isEdit: true,
            isNew: false,
            isDialog: false
          }),
          i18n: { t: t => t }
        })
      ).to.deep.equal(expected);
    });
  });
});
