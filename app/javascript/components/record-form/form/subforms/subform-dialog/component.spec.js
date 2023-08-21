import { mountedComponent, screen } from "../../../../../test-utils";
import { FieldRecord, FormSectionRecord } from "../../../records";

import SubformDialog from "./component";

describe("<SubformDialog />", () => {
  const props = {
    arrayHelpers: {},
    dialogIsNew: true,
    field: FieldRecord({
      name: "services_section",
      subform_section_id: FormSectionRecord({
        unique_id: "services_subform_section",
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
      })
    }),
    formik: {
      values: [],
      errors: { services_section: [{ relation_name: "required" }] }
    },
    mode: {
      isEdit: true
    },
    initialSubformValue: {
      relation_name: "",
      relation_child_is_in_contact: ""
    },
    index: 0,
    i18n: { t: value => value },
    open: true,
    setOpen: () => {},
    title: "Family details",
    formSection: {},
    violationOptions: []
  };

  const formProps = {
    initialValues: {
      relation_name: "test",
      relation_child_is_in_contact: ""
    }
  };

  it("render the subform", () => {
    mountedComponent(<SubformDialog {...props} />, {}, [], {}, formProps);
    expect(screen.getByTestId("subForm-dialog-form")).toBeInTheDocument();
  });

  it("renders the FormSectionField", () => {
    mountedComponent(<SubformDialog {...props} />, {}, [], {}, formProps);
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });

  it("renders an InternalAlert if there are errors", () => {
    mountedComponent(<SubformDialog {...props} />, {}, [], {}, formProps);
    expect(screen.getAllByTestId("internal-alert-message")).toHaveLength(1);
  });

  it("renders the ConfirmationModal component", () => {
    mountedComponent(<SubformDialog {...props} />, {}, [], {}, formProps);
    expect(screen.getByRole("presentation")).toBeInTheDocument();
  });

  describe("when field is visible should not be render", () => {
    const propsFieldNotVisible = {
      arrayHelpers: {},
      dialogIsNew: true,
      field: FieldRecord({
        name: "services_section",
        subform_section_id: FormSectionRecord({
          fields: [
            FieldRecord({
              name: "relation_name",
              type: "text_field",
              visible: true
            }),
            FieldRecord({
              name: "relation_child_is_in_contact",
              type: "text_field",
              visible: false
            })
          ]
        })
      }),
      formik: {
        values: []
      },
      mode: {
        isShow: true
      },
      initialSubformValue: {
        relation_name: "",
        relation_child_is_in_contact: ""
      },
      index: 0,
      i18n: { t: value => value },
      open: true,
      setOpen: () => {},
      title: "Family details",
      formSection: {}
    };

    const visibleFieldFormProps = {
      initialValues: {
        relation_name: "",
        relation_child_is_in_contact: ""
      }
    };

    it("render the subform", () => {
      mountedComponent(<SubformDialog {...propsFieldNotVisible} />, {}, [], {}, visibleFieldFormProps);
      expect(screen.getByRole("presentation")).toBeInTheDocument();
    });

    it("renders the visible FormSectionField", () => {
      mountedComponent(<SubformDialog {...propsFieldNotVisible} />, {}, [], {}, visibleFieldFormProps);
      expect(screen.getAllByRole("textbox")).toHaveLength(1);
    });
  });

  describe("when the dialog is open", () => {
    const subformProps = {
      arrayHelpers: {},
      dialogIsNew: true,
      field: FieldRecord({
        name: "services_section",
        subform_section_id: FormSectionRecord({
          fields: [
            FieldRecord({
              name: "option_type",
              type: "select_box",
              visible: true,
              selected_value: "option_2",
              option_strings_text: [
                {
                  id: "option_1",
                  display_text: { en: "Option 1" }
                },
                {
                  id: "option_2",
                  display_text: { en: "Option 2" }
                }
              ]
            }),
            FieldRecord({
              name: "option_description",
              type: "text_field",
              visible: true
            })
          ]
        })
      }),
      mode: {
        isEdit: true
      },
      index: 0,
      i18n: { t: value => value },
      open: true,
      setOpen: () => {},
      title: "Services Section",
      formSection: {},
      formik: {
        values: {}
      }
    };

    describe("when subform does not have values", () => {
      it("should set the default values", () => {
        mountedComponent(<SubformDialog {...subformProps} />, {}, [], {}, {});
        expect(screen.getByPlaceholderText(/fields.select_single/i)).toBeInTheDocument();
      });
    });

    describe("when subform has values", () => {
      const sProps = {
        ...subformProps,
        formik: {
          values: { services_section: [{ option_type: "option_1" }] }
        }
      };

      it("default values should not be set", () => {
        mountedComponent(<SubformDialog {...sProps} />, {}, [], {}, {});
        expect(screen.getByPlaceholderText(/fields.select_single/i)).toBeInTheDocument();
      });
    });
  });

  describe("when a list of field is present on subform_section_configuration", () => {
    const propsRenderSomeFields = {
      arrayHelpers: {},
      dialogIsNew: true,
      field: FieldRecord({
        name: "services_section",
        subform_section_id: FormSectionRecord({
          unique_id: "services_subform_section",
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
            }),
            FieldRecord({
              name: "relation_field_wont_be_rendered",
              visible: true,
              type: "text_field"
            })
          ]
        }),
        subform_section_configuration: {
          fields: ["relation_name", "relation_child_is_in_contact", ""]
        }
      }),
      formik: {
        values: [],
        errors: { services_subform_section: [{ relation_name: "required" }] }
      },
      mode: {
        isShow: true
      },
      initialSubformValue: {
        relation_name: "",
        relation_child_is_in_contact: "",
        relation_field_wont_be_rendered: "  "
      },
      index: 0,
      i18n: { t: value => value },
      open: true,
      setOpen: () => {},
      title: "Family details",
      formSection: {}
    };

    const formPropsRenderSomeFields = {
      initialValues: {
        relation_name: "",
        relation_child_is_in_contact: ""
      }
    };

    it("renders some FormSectionField", () => {
      mountedComponent(<SubformDialog {...propsRenderSomeFields} />, {}, [], {}, formPropsRenderSomeFields);
      expect(screen.getAllByRole("textbox")).toHaveLength(2);
    });
  });

  describe("when the prop isViolation is true", () => {
    const inviteProsp = {
      ...props,
      open: true,
      isViolation: true,
      title: "This is a title"
    };

    it("render the subform", () => {
      mountedComponent(<SubformDialog {...inviteProsp} />, {}, [], {}, {});
      expect(screen.getByTestId("subForm-dialog-form")).toBeInTheDocument();
    });

    it("renders SubformDrawer", () => {
      mountedComponent(<SubformDialog {...inviteProsp} />, {}, [], {}, {});
      expect(screen.getByTestId("subForm-dialog-form")).toBeInTheDocument();
    });

    it("renders ViolationTitle", () => {
      mountedComponent(<SubformDialog {...inviteProsp} />, {}, [], {}, {});
      expect(screen.getByTestId("violation-title")).toBeInTheDocument();
    });

    it("renders ViolationActions", () => {
      mountedComponent(<SubformDialog {...inviteProsp} />, {}, [], {}, {});
      expect(screen.getByText("incident.violation.save_and_return")).toBeInTheDocument();
    });
  });

  describe("when the prop isViolationAssociation is true", () => {
    const violationAssociationProps = {
      ...props,
      open: true,
      isViolationAssociation: true,
      title: "This is a title",
      parentTitle: "Parent"
    };

    it("renders ViolationActions", () => {
      mountedComponent(<SubformDialog {...violationAssociationProps} />, {}, [], {}, {});
      expect(screen.getByText("incident.violation.save_and_return")).toBeInTheDocument();
    });
  });
});