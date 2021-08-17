import { fromJS, List } from "immutable";

import { FormSectionRecord, FieldRecord } from "../../record-form/records";
import { MODULES, RECORD_TYPES } from "../../../config";

import formattedFields from "./formatted-fields";

describe("<ReportForm>/utils/buildFields()", () => {
  it("returns data excluding some field types when isReportable is false", () => {
    const i18n = {
      locale: "en",
      t: item => item
    };

    const formSections = List([
      FormSectionRecord({
        name: { en: "testFormCase" },
        parent_form: "case",
        module_ids: MODULES.CP,
        fields: [
          FieldRecord({
            display_name: {
              en: "Test 1"
            },
            name: "status",
            type: "text_field",
            visible: true
          }),
          FieldRecord({
            display_name: {
              en: "Test 2"
            },
            name: "owned_by",
            type: "select_field",
            visible: true
          }),
          FieldRecord({
            display_name: {
              en: "Test 3"
            },
            name: "test3",
            type: "date_field",
            visible: true
          })
        ]
      }),
      FormSectionRecord({
        name: { en: "testFormIncident" },
        parent_form: "incident",
        module_ids: MODULES.CP,
        fields: [
          FieldRecord({
            display_name: {
              en: "Test 4"
            },
            name: "status",
            type: "text_field",
            visible: true
          }),
          FieldRecord({
            display_name: {
              en: "Test 5"
            },
            name: "test5",
            type: "text_field",
            visible: true
          })
        ]
      }),
      FormSectionRecord({
        name: { en: "testFormCase" },
        parent_form: "tracing_request",
        module_ids: MODULES.CP,
        fields: [
          FieldRecord({
            display_name: {
              en: "Test 6"
            },
            name: "record_state",
            type: "text_field",
            visible: true
          }),
          FieldRecord({
            display_name: {
              en: "Test 7"
            },
            name: "test7",
            type: "text_field",
            visible: true
          })
        ]
      })
    ]);

    const reportingLocationConfig = fromJS({
      field_key: "owned_by_location",
      admin_level: 2,
      admin_level_map: {
        "1": ["province"],
        "2": ["district"]
      },
      hierarchy_filter: [],
      label_keys: ["district"]
    });

    const reportableFields = {
      case: [
        {
          id: "status",
          display_text: "Test 1",
          formSection: "minimum_reportable_fields",
          option_strings_source: undefined,
          option_strings_text: null,
          tick_box_label: undefined,
          type: "text_field"
        }
      ],
      incident: [
        {
          display_text: "Test 4",
          formSection: "minimum_reportable_fields",
          id: "status",
          option_strings_source: undefined,
          option_strings_text: null,
          tick_box_label: undefined,
          type: "text_field"
        }
      ],
      tracing_request: [
        {
          display_text: "Test 6",
          formSection: "minimum_reportable_fields",
          id: "record_state",
          option_strings_source: undefined,
          option_strings_text: null,
          tick_box_label: undefined,
          type: "text_field"
        }
      ]
    };

    const expected = [
      {
        display_text: "Test 3",
        formSection: "testFormCase",
        id: "test3",
        option_strings_source: undefined,
        option_strings_text: null,
        tick_box_label: undefined,
        type: "date_field"
      }
    ];

    expect(
      formattedFields(formSections, MODULES.CP, RECORD_TYPES.cases, i18n, reportingLocationConfig, reportableFields)
    ).to.deep.equal(expected);
  });

  describe("when the recordType is not a nested type", () => {
    const formSections = List([
      FormSectionRecord({
        name: { en: "Status Form" },
        parent_form: RECORD_TYPES.cases,
        module_ids: [MODULES.CP],
        fields: [
          FieldRecord({
            display_name: {
              en: "Status Field"
            },
            name: "status",
            type: "select_box",
            visible: true
          })
        ]
      }),
      FormSectionRecord({
        name: { en: "Nested Form" },
        unique_id: "nested_form",
        parent_form: RECORD_TYPES.cases,
        module_ids: [MODULES.CP],
        is_nested: true,
        fields: [
          FieldRecord({
            display_name: {
              en: "Nested Field"
            },
            name: "nested_field",
            type: "select_box",
            visible: true
          })
        ]
      })
    ]);

    const i18n = {
      locale: "en",
      t: item => item
    };

    const reportingLocationConfig = fromJS({
      field_key: "owned_by_location",
      admin_level: 2,
      admin_level_map: {
        "1": ["province"],
        "2": ["district"]
      },
      hierarchy_filter: [],
      label_keys: ["district"]
    });

    it("should not return fields on nested forms", () => {
      expect(
        formattedFields(formSections, MODULES.CP, RECORD_TYPES.cases, i18n, reportingLocationConfig, [])
      ).to.deep.equal([
        {
          display_text: "Status Field",
          formSection: "Status Form",
          id: "status",
          option_strings_source: undefined,
          option_strings_text: null,
          tick_box_label: undefined,
          type: "select_box"
        }
      ]);
    });
  });
});
