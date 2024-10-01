import { fromJS, OrderedMap } from "immutable";

import { ACTIONS } from "../permissions";
import { mountedComponent, screen, userEvent } from "../../test-utils";
import { FieldRecord, FormSectionRecord } from "../record-form/records";
import { PrimeroModuleRecord } from "../application/records";

import RecordList from "./container";

describe("<RecordList />", () => {
  const initialState = fromJS({
    records: {
      FiltersTabs: {
        current: 0
      },
      cases: {
        data: [
          {
            id: "e15acbe5-9501-4615-9f43-cb6873997fc1",
            case_id_display: "e15acbe",
            short_id: "e15acbe",
            name: "Jose",
            record_state: true,
            module_id: "primeromodule-cp",
            age: 0
          },
          {
            id: "7d55b677-c9c4-7c6c-7a41-bfa1c3f74d1c",
            case_id_display: "7d55b67",
            short_id: "7d55b67",
            name: "Carlos",
            record_state: true,
            module_id: "primeromodule-cp",
            age: 5
          }
        ],
        metadata: { total: 2, per: 20, page: 1 },
        filters: {
          id_search: false,
          query: "",
          record_state: ["true"]
        },
        loading: false,
        errors: false
      }
    },
    user: {
      modules: ["primeromodule-cp"],
      listHeaders: {
        cases: [
          { id: "name", name: "Name", field_name: "name" },
          { id: "age", name: "Age", field_name: "age" }
        ]
      },
      filters: {
        cases: [
          {
            name: "cases.filter_by.enabled_disabled",
            field_name: "record_state",
            option_strings_source: null,
            options: {
              en: [
                { id: "true", display_name: "Enabled" },
                { id: "false", display_name: "Disabled" }
              ]
            },
            type: "multi_toggle"
          }
        ]
      },
      permissions: {
        cases: [ACTIONS.MANAGE, ACTIONS.DISPLAY_VIEW_PAGE]
      }
    },
    forms: {
      formSections: OrderedMap({
        1: FormSectionRecord({
          id: 1,
          unique_id: "incident_details_subform_section",
          name: { en: "Nested Incident Details Subform" },
          visible: false,
          is_first_tab: false,
          order: 20,
          order_form_group: 110,
          parent_form: "case",
          editable: true,
          module_ids: [],
          form_group_id: "",
          form_group_name: { en: "Nested Incident Details Subform" },
          fields: [2],
          is_nested: true,
          subform_prevent_item_removal: false,
          collapsed_field_names: ["cp_incident_date", "cp_incident_violence_type"]
        }),
        2: FormSectionRecord({
          id: 2,
          unique_id: "incident_details_container",
          name: { en: "Incident Details" },
          visible: true,
          is_first_tab: false,
          order: 0,
          order_form_group: 30,
          parent_form: "case",
          editable: true,
          module_ids: ["primeromodule-cp"],
          form_group_id: "identification_registration",
          form_group_name: { en: "Identification / Registration" },
          fields: [1],
          is_nested: false,
          subform_prevent_item_removal: false,
          collapsed_field_names: []
        }),
        3: FormSectionRecord({
          id: 3,
          unique_id: "basic_form",
          name: { en: "Basic Form" },
          visible: true,
          is_first_tab: false,
          order: 0,
          order_form_group: 30,
          parent_form: "case",
          editable: true,
          module_ids: ["primeromodule-cp"],
          form_group_id: "identification_registration",
          form_group_name: { en: "Identification / Registration" },
          fields: [2, 3, 4, 5, 6, 7],
          is_nested: false,
          subform_prevent_item_removal: false,
          collapsed_field_names: []
        })
      }),
      fields: OrderedMap({
        1: FieldRecord({
          name: "incident_details",
          type: "subform",
          editable: true,
          disabled: false,
          visible: true,
          subform_section_id: 1,
          help_text: { en: "" },
          display_name: { en: "" },
          multi_select: false,
          option_strings_source: null,
          option_strings_text: {},
          guiding_questions: "",
          required: false,
          date_validation: "default_date_validation",
          hide_on_view_page: false,
          date_include_time: false,
          selected_value: "",
          subform_sort_by: "summary_date",
          show_on_minify_form: false
        }),
        2: FieldRecord({
          name: "cp_incident_location_type_other",
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
        }),
        3: FieldRecord({
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
          show_on_minify_form: true
        }),
        4: FieldRecord({
          name: "sex",
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
        }),
        5: FieldRecord({
          name: "age",
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
        }),
        6: FieldRecord({
          name: "estimated",
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
        }),
        7: FieldRecord({
          name: "date_of_birth",
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
        })
      }),
      options: {
        lookups: [
          {
            id: 1,
            unique_id: "lookup-sex",
            name: { en: "Sex" },
            values: [
              { id: "male", display_text: { en: "Male" } },
              { id: "female", display_text: { en: "Female" } }
            ]
          }
        ]
      },
      loading: false,
      errors: false
    },
    application: {
      modules: [
        PrimeroModuleRecord({
          unique_id: "primeromodule-cp",
          name: "CP",
          associated_record_types: ["case"],
          list_headers: {
            cases: ["id", "name", "age"]
          }
        })
      ]
    },
    connectivity: {
      online: true,
      serverOnline: true
    }
  });

  it("renders record list table", () => {
    mountedComponent(<RecordList />, initialState, {}, ["/cases"], {}, "/cases");
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("opens the view modal when a record is clicked", async () => {
    const user = userEvent.setup();

    mountedComponent(<RecordList />, initialState, {}, ["/cases"], {}, "/cases");

    await user.click(screen.getByText("Jose"));

    expect(screen.getByText("buttons.request_transfer")).toBeInTheDocument();
  });

  it("renders filters", () => {
    mountedComponent(<RecordList />, initialState, {}, ["/cases"], {}, "/cases");
    expect(screen.getByTestId("filters")).toBeInTheDocument();
  });

  it("renders RecordListToolbar", () => {
    mountedComponent(<RecordList />, initialState, {}, ["/cases"], {}, "/cases");
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });

  describe("when offline", () => {
    it("when a record is clicked it does not open the view modal", async () => {
      const user = userEvent.setup();

      mountedComponent(
        <RecordList />,
        initialState.setIn(["connectivity", "online"], false),
        {},
        ["/cases"],
        {},
        "/cases"
      );

      await user.click(screen.getByText("Jose"));

      expect(screen.queryByText("buttons.request_transfer")).toBeNull();
    });
  });

  describe("when age is 0", () => {
    it("renders a 0 in the cell ", () => {
      mountedComponent(<RecordList />, initialState, {}, ["/cases"], {}, "/cases");

      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });
});
