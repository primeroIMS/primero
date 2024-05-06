import { Map, fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../test-utils";
import { FieldRecord, FormSectionRecord } from "../../../records";
import { TRACING_REQUEST_STATUS_FIELD_NAME, TRACES_SUBFORM_UNIQUE_ID } from "../../../../../config";

import SubformFieldArray from "./component";

describe("<SubformFieldArray />", () => {
  const props = {
    arrayHelpers: {},
    formSection: {
      id: 33,
      unique_id: "family_details",
      description: {
        en: "Family Details"
      },
      name: {
        en: "Family Details"
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
      }
    },
    field: FieldRecord({
      name: "family_details_section",
      display_name: { en: "Family Details" },
      subform_section_id: FormSectionRecord({
        unique_id: "family_section",
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
      subform_section_configuration: {
        subform_sort_by: "relation_name"
      },
      disabled: false,
      guiding_questions: { en: "This is a Guidance" }
    }),
    formik: {
      values: {
        family_details_section: [
          { relation_name: "father", relation_child_is_in_contac: "test A" },
          { relation_name: "aut", relation_child_is_in_contac: "test B" }
        ]
      },
      setValues: () => {},
      errors: { services_subform_section: [{ relation_name: "required" }] }
    },
    i18n: { t: value => value, locale: "en" },
    initialSubformValue: {
      relation_name: "",
      relation_child_is_in_contact: ""
    },
    mode: {
      isShow: false,
      isEdit: true
    },
    recordType: "cases",
    isReadWriteForm: true,
    form: {},
    forms: fromJS({}),
    recordModuleID: "primeromodule-cp"
  };

  const formProps = {
    initialValues: {
      relation_name: "",
      relation_child_is_in_contact: ""
    }
  };

  it("render the subform", () => {
    mountedComponent(<SubformFieldArray {...props} />, {}, [], {}, formProps);
    expect(screen.getByTestId("subForm-field-array")).toBeInTheDocument();
  });

  it("renders the SubformDialog", () => {
    mountedComponent(<SubformFieldArray {...props} />, {}, [], {}, formProps);
    expect(screen.getAllByTestId("fields-add")).toHaveLength(1);
  });

  it("renders the SubformFields", () => {
    mountedComponent(<SubformFieldArray {...props} />, {}, [], {}, formProps);
    expect(screen.getAllByTestId("list-item")).toHaveLength(2);
  });

  it("renders the SubformHeader", () => {
    mountedComponent(<SubformFieldArray {...props} />, {}, [], {}, formProps);
    expect(screen.getAllByTestId("subForm-header")).toHaveLength(1);
  });

  it("renders the SubformAddEntry", () => {
    mountedComponent(<SubformFieldArray {...props} />, {}, [], {}, formProps);
    expect(screen.getAllByTestId("subForm-add")).toHaveLength(1);
  });

  it("renders the AddIcon", () => {
    mountedComponent(<SubformFieldArray {...props} />, {}, [], {}, formProps);
    expect(screen.getAllByTestId("fields-add")).toHaveLength(1);
  });

  it("renders the GuidingQuestions", () => {
    mountedComponent(<SubformFieldArray {...props} />, {}, [], {}, formProps);
    expect(screen.getByText("buttons.guidance")).toBeInTheDocument();
  });

  describe("when is a tracing request and the traces subform", () => {
    const tracingProps = {
      ...props,
      recordType: "tracing_requests",
      formSection: {
        ...props.formSection,
        unique_id: TRACES_SUBFORM_UNIQUE_ID
      },
      mode: {
        isShow: true
      }
    };

    it("renders the SubformDrawer", () => {
      mountedComponent(
        <SubformFieldArray {...tracingProps} />,
        Map({
          forms: Map({
            fields: [{ name: TRACING_REQUEST_STATUS_FIELD_NAME, option_strings_source: "lookup lookup-test" }]
          })
        }),
        [],
        {}
      );
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("should not render the SubformDialog", () => {
      mountedComponent(
        <SubformFieldArray {...tracingProps} />,
        Map({
          forms: Map({
            fields: [{ name: TRACING_REQUEST_STATUS_FIELD_NAME, option_strings_source: "lookup lookup-test" }]
          })
        }),
        [],
        {}
      );
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  describe("when is a violation", () => {
    const incidentProps = {
      ...props,
      recordType: "incidents",
      formSection: {
        ...props.formSection,
        unique_id: "killing"
      },
      mode: {
        isShow: true
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
      })
    };

    it("should render title", () => {
      mountedComponent(
        <SubformFieldArray {...incidentProps} />,
        fromJS({
          forms: {
            fields: [{ name: "killing" }]
          }
        }),
        [],
        {}
      );
      expect(screen.getAllByText(/Family Details/i)).toHaveLength(3);
    });
  });

  describe("when is a violation association", () => {
    const violationProps = {
      ...props,
      recordType: "incidents",
      parentTitle: "Title",
      formSection: {
        ...props.formSection,
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
      })
    };

    it("should render SubformAddEntry", () => {
      mountedComponent(
        <SubformFieldArray {...violationProps} />,
        fromJS({
          forms: {
            fields: [{ name: "killing" }]
          }
        }),
        [],
        {}
      );
      expect(screen.getByTestId("subForm-add")).toBeInTheDocument();
    });

    it("should render Menu", () => {
      mountedComponent(
        <SubformFieldArray {...violationProps} />,
        fromJS({
          forms: {
            fields: [{ name: "killing" }]
          }
        }),
        [],
        {}
      );
      expect(screen.getByTestId("menu")).toBeInTheDocument();
    });

    it("should render MenuItem", () => {
      mountedComponent(
        <SubformFieldArray {...violationProps} />,
        fromJS({
          forms: {
            fields: [{ name: "killing" }]
          }
        }),
        [],
        {}
      );
      expect(screen.getByTestId("menu-item")).toBeInTheDocument();
    });

    it("should render add button", () => {
      mountedComponent(
        <SubformFieldArray {...violationProps} />,
        fromJS({
          forms: {
            fields: [{ name: "killing" }]
          }
        }),
        [],
        {}
      );
      expect(screen.getAllByTestId("fields-add")).toHaveLength(1);
    });
  });
});
