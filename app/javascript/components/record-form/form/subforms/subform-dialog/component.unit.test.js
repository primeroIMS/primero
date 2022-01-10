import { Formik } from "formik";
import Autocomplete from "@material-ui/lab/Autocomplete";

import { setupMountedComponent } from "../../../../../test";
import { FieldRecord, FormSectionRecord } from "../../../records";
import TextField from "../../field-types/text-field";
import InternalAlert from "../../../../internal-alert";
import ActionDialog from "../../../../action-dialog";
import SubformDrawer from "../subform-drawer";
import ViolationActions from "../subform-fields/components/violation-actions";
import ViolationTitle from "../subform-fields/components/violation-title";
import ActionButton from "../../../../action-button";
import SubformDialogFields from "../subform-dialog-fields";

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

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(SubformDialog, props, {}, [], formProps));
  });

  it("render the subform", () => {
    expect(component.find(SubformDialog)).lengthOf(1);
  });

  it("renders the FormSectionField", () => {
    expect(component.find(TextField)).lengthOf(2);
  });

  it("renders an InternalAlert if there are errors", () => {
    expect(component.find(InternalAlert)).lengthOf(1);
  });

  it("renders the ConfirmationModal component", () => {
    const subformDialog = component.find(SubformDialog);

    expect(component.find(ActionDialog)).lengthOf(2);

    // Editing a relation_name text-field
    subformDialog
      .find(Formik)
      .find("input")
      .first()
      .simulate("change", { target: { value: "abc" } });

    // Clicking cancel button
    subformDialog.find("button").at(2).simulate("click");

    const confirmationModal = component.find(ActionDialog).last().props();

    expect(confirmationModal.open).to.be.true;
    expect(confirmationModal.dialogText).to.be.equal("messages.confirmation_message");
  });

  it("renders SubformDialog with valid props", () => {
    const subformDialogProps = { ...component.find(SubformDialog).props() };

    [
      "arrayHelpers",
      "dialogIsNew",
      "field",
      "formSection",
      "formik",
      "i18n",
      "index",
      "initialSubformValue",
      "mode",
      "open",
      "setOpen",
      "title",
      "violationOptions"
    ].forEach(property => {
      expect(subformDialogProps).to.have.property(property);
      delete subformDialogProps[property];
    });
    expect(subformDialogProps).to.be.empty;
  });

  it("renders SubformDialogFields with valid props", () => {
    const subformDialogFieldsProps = { ...component.find(SubformDialogFields).props() };

    [
      "field",
      "mode",
      "index",
      "formSection",
      "isReadWriteForm",
      "values",
      "parentValues",
      "parentTitle",
      "parentViolationOptions",
      "arrayHelpers",
      "isViolation",
      "isViolationAssociation",
      "setFieldValue"
    ].forEach(property => {
      expect(subformDialogFieldsProps).to.have.property(property);
      delete subformDialogFieldsProps[property];
    });
    expect(subformDialogFieldsProps).to.be.empty;
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

    beforeEach(() => {
      ({ component } = setupMountedComponent(SubformDialog, propsFieldNotVisible, {}, [], visibleFieldFormProps));
    });

    it("render the subform", () => {
      expect(component.find(SubformDialog)).lengthOf(1);
    });

    it("renders the visible FormSectionField", () => {
      expect(component.find(TextField)).lengthOf(1);
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
      formSection: {}
    };

    context("when subform does not have values", () => {
      beforeEach(() => {
        ({ component } = setupMountedComponent(
          SubformDialog,
          {
            ...subformProps,
            formik: {
              values: {}
            }
          },
          {},
          [],
          {}
        ));
      });

      it("should set the default values", () => {
        expect(component.find(Autocomplete).props().value).to.equal("option_2");
      });
    });

    context("when subform has values", () => {
      beforeEach(() => {
        ({ component } = setupMountedComponent(
          SubformDialog,
          {
            ...subformProps,
            formik: {
              values: { services_section: [{ option_type: "option_1" }] }
            }
          },
          {},
          [],
          {}
        ));
      });

      it("default values should not be set", () => {
        expect(component.find(Autocomplete).props().value).to.equal("option_1");
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

    beforeEach(() => {
      ({ component } = setupMountedComponent(SubformDialog, propsRenderSomeFields, {}, [], formPropsRenderSomeFields));
    });

    it("renders some FormSectionField", () => {
      expect(component.find(TextField)).lengthOf(2);
    });
  });

  describe("when the prop isViolation is true", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(SubformDialog, {
        ...props,
        open: true,
        isViolation: true,
        title: "This is a title"
      }));
    });

    it("render the subform", () => {
      expect(component.find(SubformDialog)).lengthOf(1);
    });

    it("renders SubformDrawer", () => {
      expect(component.find(SubformDrawer)).lengthOf(1);
    });

    it("renders ViolationTitle", () => {
      expect(component.find(ViolationTitle)).lengthOf(1);
    });

    it("renders ViolationActions", () => {
      expect(component.find(ViolationActions)).lengthOf(1);
      expect(component.find(ViolationActions).find(ActionButton).first().text()).to.be.equal(
        "incident.violation.back_to_violations"
      );
    });

    it("renders ViolationActions with valid props", () => {
      const violationActionsProps = { ...component.find(ViolationActions).props() };

      ["handleBackLabel", "handleBack", "handleCancel"].forEach(property => {
        expect(violationActionsProps).to.have.property(property);
        delete violationActionsProps[property];
      });
      expect(violationActionsProps).to.be.empty;
    });
  });

  describe("when the prop isViolationAssociation is true", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(SubformDialog, {
        ...props,
        open: true,
        isViolationAssociation: true,
        title: "This is a title",
        parentTitle: "Parent"
      }));
    });

    it("renders ViolationActions", () => {
      expect(component.find(ViolationActions)).lengthOf(1);
      expect(component.find(ViolationActions).find(ActionButton).first().text()).to.be.equal(
        "incident.violation.back_to Parent"
      );
    });
  });
});
