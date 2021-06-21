import { List } from "immutable";

import { FormSectionRecord, FieldRecord } from "../../record-form/records";

import buildMinimumReportableFields from "./build-minimum-reportable-fields";

describe("<ReportForm>/utils/buildFields()", () => {
  it("returns data excluding some field types when isReportable is false", () => {
    const i18n = {
      locale: "en",
      t: item => item
    };

    const forms = List([
      FormSectionRecord({
        name: { en: "testFormCase" },
        parent_form: "case",
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
            type: "text_field",
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

    const expected = {
      case: [
        {
          id: "status",
          display_text: "Test 1",
          formSection: "minimum_reportable_fields",
          option_strings_source: undefined,
          option_strings_text: null,
          tick_box_label: undefined,
          type: "text_field"
        },
        {
          id: "owned_by",
          display_text: "Test 2",
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

    expect(buildMinimumReportableFields(i18n, forms)).to.deep.equal(expected);
  });
});
