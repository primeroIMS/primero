// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";
import { FormSectionRecord, FieldRecord, TEXT_FIELD, DATE_FIELD, NUMERIC_FIELD, SELECT_FIELD } from "../../../form";
import { RECORD_TYPES } from "../../../../config";

import ComparisonForm from "./component";

describe("<ComparisonForm />", () => {
  const recordModule = "record-module";

  const props = {
    selectedForm: "test",
    recordType: "cases",
    potentialMatch: fromJS({}),
    handleBack: () => {}
  };

  const initialState = fromJS({
    forms: {
      formSections: {
        1: FormSectionRecord({
          id: 1,
          unique_id: "first_form",
          name: { en: "First Form" },
          description: { en: "First Form" },
          fields: [1, 2, 3, 4, 5, 6],
          module_ids: [recordModule],
          parent_form: RECORD_TYPES.cases,
          is_nested: false,
          order: 1,
          form_group_id: "group_1",
          order_form_group: 1,
          visible: true
        }),
        2: FormSectionRecord({
          id: 2,
          unique_id: "second_form",
          name: { en: "Second Form" },
          description: { en: "Second Form" },
          fields: [7],
          module_ids: [recordModule],
          parent_form: RECORD_TYPES.cases,
          is_nested: false,
          order: 2,
          form_group_id: "group_1",
          order_form_group: 1,
          visible: true
        })
      },
      fields: {
        1: FieldRecord({ id: 1, display_name: { en: "Name" }, name: "name", type: TEXT_FIELD }),
        2: FieldRecord({ id: 2, display_name: { en: "Nickname" }, name: "name_nickname", type: TEXT_FIELD }),
        3: FieldRecord({
          id: 3,
          display_name: { en: "Sex" },
          name: "sex",
          type: SELECT_FIELD,
          options_strings_source: "lookup lookup-gender"
        }),
        4: FieldRecord({ id: 4, display_name: { en: "Age" }, name: "age", type: NUMERIC_FIELD }),
        5: FieldRecord({ id: 5, display_name: { en: "Date of Birth" }, name: "date_of_birth", type: DATE_FIELD }),
        6: FieldRecord({ id: 6, display_name: { en: "Field 1" }, name: "field_1", type: TEXT_FIELD }),
        7: FieldRecord({ id: 7, display_name: { en: "Field 2" }, name: "field_2", type: TEXT_FIELD })
      },
      options: {
        lookups: [
          {
            id: 1,
            unique_id: "lookup-gender",
            name: { en: "Gender" },
            values: [
              { id: "male", display_text: { en: "Male" } },
              { id: "female", display_text: { en: "Female" } }
            ]
          }
        ]
      }
    },
    records: {
      cases: { data: [{ id: "trq-9876-5432", module_id: recordModule }] }
    }
  });

  it("should render 1 <TraceComparisonForm /> component", () => {
    mountedComponent(<ComparisonForm {...props} />, initialState);

    expect(screen.getByTestId("trace-actions")).toBeInTheDocument();
    expect(screen.getByTestId("trace-comparison-form")).toBeInTheDocument();
  });
});
