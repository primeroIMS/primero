// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../test-utils";
import { FieldRecord, FormSectionRecord } from "../../../records";

import SubformAddEntry from "./component";

describe("<SubformAddEntry />", () => {
  const props = {
    arrayHelpers: {},
    i18n: { t: value => value, locale: "en" },
    initialSubformValue: {
      relation_name: "",
      relation_child_is_in_contact: ""
    },
    isReadWriteForm: true,
    form: {},
    recordModuleID: "primeromodule-cp",
    recordType: "incidents",
    parentTitle: "Title",
    formSection: {
      id: 33,
      description: {
        en: "Individual Details"
      },
      name: {
        en: "Individual Details"
      },
      visible: true,
      is_first_tab: false,
      order: 10,
      order_form_group: 30,
      parent_form: "case",
      editable: true,
      module_ids: ["primeromodule-cp"],
      form_group_id: "identification_registration",
      form_group_name: {
        en: "Identification / Registration"
      },
      unique_id: "individual_victims_subform_section"
    },
    mode: {
      isShow: false
    },
    forms: fromJS({
      formSections: {
        1: {
          id: 1,
          name: {
            en: "Form Section 1"
          },
          unique_id: "form_section_1",
          module_ids: ["some_module"],
          visible: true,
          is_nested: false,
          parent_form: "cases",
          fields: [1, 2, 3]
        }
      },
      fields: {
        1: {
          id: 1,
          name: "field_1",
          display_name: {
            en: "Field 1"
          },
          type: "text_field",
          required: true,
          visible: true
        },
        2: {
          id: 2,
          name: "field_2",
          display_name: {
            en: "Field 2"
          },
          type: "subform",
          visible: true
        }
      }
    }),
    formik: {
      values: [
        {
          killing: {
            unique_id: "abc123"
          }
        }
      ]
    },
    parentValues: {
      values: [
        {
          killing: {
            unique_id: "def456"
          }
        }
      ]
    },
    field: FieldRecord({
      name: "killing",
      display_name: { en: "Killing" },
      subform_section_id: FormSectionRecord({
        unique_id: "killing_section",
        fields: [
          FieldRecord({
            name: "relation_name",
            visible: true,
            type: "text_field"
          }),
          FieldRecord({
            name: "relation_child_is_in_contact",
            visible: true,
            type: "text_field"
          })
        ]
      }),
      disabled: false
    }),
    isViolationAssociation: true,
    setDialogIsNew: () => {},
    setOpenDialog: () => {}
  };

  const formProps = {
    initialValues: {
      relation_name: "",
      relation_child_is_in_contact: ""
    }
  };

  it("render the SubformAddEntry", () => {
    mountedComponent(<SubformAddEntry {...props} />, {}, [], {}, formProps);
    expect(screen.getByTestId("subForm-add")).toBeInTheDocument();
  });

  it("renders the ActionButton", () => {
    mountedComponent(<SubformAddEntry {...props} />, {}, [], {}, formProps);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders the Menu", () => {
    mountedComponent(<SubformAddEntry {...props} />, {}, [], {}, formProps);
    expect(screen.getByTestId("menu")).toBeInTheDocument();
  });

  it("renders the MenuItem", () => {
    mountedComponent(<SubformAddEntry {...props} />, {}, [], {}, formProps);
    expect(screen.getByTestId("menu-item")).toBeInTheDocument();
  });

  describe("when the field is a response", () => {
    const responseProps = {
      ...props,

      field: FieldRecord({
        name: "responses",
        display_name: { en: "Response" },
        subform_section_id: FormSectionRecord({
          unique_id: "responses_section",
          fields: [
            FieldRecord({
              name: "responses_field",
              visible: true,
              type: "text_field"
            })
          ]
        })
      })
    };

    it("should NOT renderd the Menu", () => {
      mountedComponent(<SubformAddEntry {...responseProps} />, {}, [], {}, formProps);
      expect(screen.getByTestId("subForm-add")).toBeInTheDocument();
      expect(screen.queryByTestId("menu")).toBeNull();
    });
  });
});
