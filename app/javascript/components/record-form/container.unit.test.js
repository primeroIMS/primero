/* eslint-disable prefer-destructuring */
import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { Map, List } from "immutable";
import { PageContainer } from "components/page";
import { LoadingIndicator } from "components/loading-indicator";
import RecordForms from "./container";

describe("<RecordForms /> - Component", () => {
  let component;

  before(() => {
    const match = {
      isExact: true,
      params: {
        recordType: "cases",
        id: "2b8d6be1-1dc4-483a-8640-4cfe87c71610"
      },
      path: "/:recordType(cases|incidents|tracing_requests)/:id",
      url: "/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"
    };
    component = setupMountedComponent(
      RecordForms,
      { match, mode: "show" },
      Map({
        ui: Map({
          I18n: Map({
            locale: "en",
            dir: "ltr"
          })
        }),
        forms: Map({
          selectedForm: "basic_identity",
          formSections: Map({
            1: Map({
              id: 62,
              unique_id: "basic_identity",
              name: Map({
                en: "Basic Identity",
                fr: "",
                ar: "",
                "ar-LB": "",
                so: "",
                es: ""
              }),
              visible: true,
              is_first_tab: true,
              order: 10,
              order_form_group: 30,
              parent_form: "case",
              editable: true,
              module_ids: ["primeromodule-cp"],
              form_group_id: "identification_registration",
              form_group_name: Map({
                en: "Identification / Registration",
                fr: "",
                ar: "",
                "ar-LB": "",
                so: "",
                es: ""
              }),
              fields: List([607, 609, 615]),
              is_nested: null
            })
          }),
          fields: Map({
            1: Map({
              name: "name_first",
              type: "text_field",
              editable: true,
              disabled: null,
              visible: true,
              display_name: {
                en: "First Name",
                fr: "",
                ar: "",
                "ar-LB": "",
                so: "",
                es: ""
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
            2: Map({
              name: "name_last",
              type: "text_field",
              editable: true,
              disabled: null,
              visible: true,
              display_name: {
                en: "Surname",
                fr: "",
                ar: "",
                "ar-LB": "",
                so: "",
                es: ""
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
            3: Map({
              name: "sex",
              type: "select_box",
              editable: true,
              disabled: null,
              visible: true,
              display_name: {
                en: "Sex",
                fr: "",
                ar: "",
                "ar-LB": "",
                so: "",
                es: ""
              },
              subform_section_id: null,
              help_text: {},
              multi_select: null,
              option_strings_source: "lookup lookup-gender",
              option_strings_text: null,
              guiding_questions: "",
              required: true,
              date_validation: "default_date_validation"
            })
          }),
          options: Map({
            1: Map({
              type: "lookup-gender",
              options: List([
                {
                  id: "male",
                  display_text: "Male"
                },
                {
                  id: "female",
                  display_text: "Female"
                }
              ])
            })
          }),
        }),
        records: Map({
          Cases: Map({
            data: List([
              Map({
                id: "e15acbe5-9501-4615-9f43-cb6873997fc1",
                age: 26,
                sex: "male",
                name: "Gerald Padgett",
                owned_by: "primero",
                created_at: "2019-08-06T20:21:19.864Z",
                case_id_display: "2063a4b",
                registration_date: "2019-08-06"
              })
            ]),
            metadata: Map({ per: 20, page: 1, total: 1 }),
            filters: Map({ status: "open" })
          })
        })
      })
    ).component;
  });

  it("renders the PageContainer", () => {
    expect(component.find(PageContainer)).to.have.length(1);
  });

  it("renders the LoadingIndicator", () => {
    expect(component.find(LoadingIndicator)).to.have.length(1);
  });
});
