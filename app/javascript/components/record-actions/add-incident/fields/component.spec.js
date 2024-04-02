import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";
import { RECORD_PATH } from "../../../../config";

import Fields from "./component";

describe("<Fields />", () => {
  const props = {
    recordType: RECORD_PATH.cases,
    fields: [
      {
        name: "name",
        type: "text_field",
        editable: true,
        disabled: false,
        visible: true,
        subform_section_id: null,
        help_text: {},
        multi_select: false,
        option_strings_source: null,
        option_strings_text: {},
        guiding_questions: "",
        required: false,
        date_validation: "default_date_validation",
        hide_on_view_page: false,
        date_include_time: false,
        selected_value: "",
        subform_sort_by: "",
        show_on_minify_form: false
      }
    ]
  };

  const initialState = fromJS({
    records: {
      cases: {
        data: [
          {
            sex: "male",
            created_at: "2020-01-07T14:27:04.136Z",
            name: "G P",
            case_id_display: "96f613f",
            owned_by: "primero_cp",
            status: "open",
            registration_date: "2020-01-07",
            id: "d9df44fb-95d0-4407-91fd-ed18c19be1ad"
          }
        ]
      }
    }
  });

  const formProps = {
    initialValues: {
      name: ""
    }
  };

  it("renders 1 FormSectionField", () => {
    mountedComponent(<Fields {...props} />, initialState, {}, {}, formProps);
    expect(screen.getByTestId("form-field")).toBeInTheDocument();
  });

  it("renders component with valid props", () => {
    mountedComponent(<Fields {...props} />, initialState, {}, {}, formProps);
    expect(screen.getByTestId("form-field")).toBeInTheDocument();
  });
});
