import { fromJS } from "immutable";

import buildFields from "./build-fields";

describe("<ReportForm>/utils/buildFields()", () => {
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

    const values = fromJS([
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

    expect(buildFields(values, "en", false)).to.deep.equal(expected);
  });
});
