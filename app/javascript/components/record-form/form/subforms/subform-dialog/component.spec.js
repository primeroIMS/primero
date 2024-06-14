import { RECORD_TYPES_PLURAL } from "../../../../../config";
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
    expect(screen.getByRole("dialog")).toBeInTheDocument();
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
      expect(screen.getByRole("dialog")).toBeInTheDocument();
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
    const inviteProps = {
      ...props,
      open: true,
      isViolation: true,
      title: "This is a title"
    };

    it("render the subform", () => {
      mountedComponent(<SubformDialog {...inviteProps} />, {}, [], {}, {});
      expect(screen.getByTestId("subForm-dialog-form")).toBeInTheDocument();
    });

    it("renders ViolationTitle", () => {
      mountedComponent(<SubformDialog {...inviteProps} />, {}, [], {}, {});
      expect(screen.getByTestId("violation-title")).toBeInTheDocument();
    });

    it("renders ViolationActions", () => {
      mountedComponent(<SubformDialog {...inviteProps} />, {}, [], {}, {});
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

  describe("when is a family member", () => {
    const familyProps = {
      arrayHelpers: {},
      dialogIsNew: true,
      formik: { values: [], errors: {} },
      mode: { isEdit: true },
      initialSubformValue: {},
      index: 0,
      i18n: { t: value => value },
      open: true,
      setOpen: () => {},
      title: "Family details",
      formSection: {},
      violationOptions: []
    };

    const familyDetailsField = FieldRecord({
      name: "family_details_section",
      subform_section_id: FormSectionRecord({
        unique_id: "family_details_subform_section",
        fields: [
          FieldRecord({
            name: "relation_name",
            visible: true,
            type: "text_field"
          }),
          FieldRecord({
            name: "relation_age",
            visible: true,
            type: "text_field"
          })
        ]
      })
    });

    describe("when is show mode", () => {
      it("renders the Family Actions to create a case if a user can create cases", () => {
        mountedComponent(
          <SubformDialog
            {...familyProps}
            recordType={RECORD_TYPES_PLURAL.case}
            field={familyDetailsField}
            mode={{ isShow: true }}
            isFamilyMember
          />,
          {
            user: { permissions: { cases: ["case_from_family"] } }
          }
        );

        expect(screen.queryByText("family.family_member.back_to_family_members")).toBeTruthy();
        expect(screen.queryByText("family.family_member.create_case")).toBeTruthy();
      });

      it("renders the Family Actions to create a case if a user can create cases from family", () => {
        mountedComponent(
          <SubformDialog
            {...familyProps}
            recordType={RECORD_TYPES_PLURAL.family}
            field={familyDetailsField}
            mode={{ isShow: true }}
            isFamilyMember
          />,
          {
            user: { permissions: { families: ["case_from_family"] } }
          }
        );

        expect(screen.queryByText("family.family_member.back_to_family_members")).toBeTruthy();
        expect(screen.queryByText("family.family_member.create_case")).toBeTruthy();
      });

      it("renders the Family Actions without the create case action if the user does not have permission", () => {
        mountedComponent(
          <SubformDialog
            {...familyProps}
            recordType={RECORD_TYPES_PLURAL.case}
            field={familyDetailsField}
            mode={{ isShow: true }}
            isFamilyMember
          />
        );

        expect(screen.queryByText("family.family_member.back_to_family_members")).toBeTruthy();
        expect(screen.queryByText("family.family_member.create_case")).toBeFalsy();
      });

      it("renders the Family Actions with a link to a case", () => {
        mountedComponent(
          <SubformDialog
            {...familyProps}
            formik={{ values: { family_details_section: [{ case_id: "001", case_id_display: "001" }] }, errors: {} }}
            recordType={RECORD_TYPES_PLURAL.family}
            field={familyDetailsField}
            mode={{ isShow: true }}
            isFamilyMember
          />
        );

        expect(screen.queryByText("family.family_member.case_id")).toBeTruthy();
        expect(screen.queryByText("001")).toBeTruthy();
      });
    });

    describe("when is edit mode", () => {
      it("renders the Family Actions for edit mode", () => {
        mountedComponent(
          <SubformDialog {...familyProps} field={familyDetailsField} mode={{ isEdit: true }} isFamilyMember />
        );

        expect(screen.queryByText("family.family_member.save_and_return")).toBeTruthy();
        expect(screen.queryByText("cancel")).toBeTruthy();
      });

      describe("and isReadWriteForm is false", () => {
        it("renders 'Back to Family Details' button", () => {
          mountedComponent(
            <SubformDialog
              {...familyProps}
              field={familyDetailsField}
              mode={{ isEdit: true }}
              isFamilyDetail
              isReadWriteForm={false}
            />
          );

          expect(screen.queryByText("case.back_to_family_details")).toBeInTheDocument();
          expect(screen.queryByText("cancel")).not.toBeInTheDocument();
        });
      });
    });
  });
});
