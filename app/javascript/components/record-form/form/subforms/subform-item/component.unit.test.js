import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../test";
import { FieldRecord, FormSectionRecord } from "../../../records";
import SubformTraces from "../subform-traces";
import SubformDialog from "../subform-dialog";
import SubformDrawer from "../subform-drawer";

import SubformItem from "./component";

describe("<SubformItem />", () => {
  let component;
  const props = {
    arrayHelpers: {},
    dialogIsNew: true,
    field: { subform_section_id: { unique_id: "perpetrators", fields: [] } },
    formik: {},
    forms: {},
    formSection: {},
    index: 0,
    isDisabled: false,
    isTraces: false,
    isReadWriteForm: false,
    isViolation: false,
    mode: {},
    open: true,
    orderedValues: [],
    recordModuleID: "primeromodule-cp",
    recordType: "cases",
    selectedValue: {},
    setOpen: () => {},
    title: "This is a title"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(SubformItem, props));
  });

  it("should render SubformItem component", () => {
    expect(component.find(SubformItem)).to.have.lengthOf(1);
  });

  describe("when is isTraces ", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(SubformItem, {
        ...props,
        isTraces: true,
        mode: { isShow: true },
        formSection: FormSectionRecord({
          fields: [],
          setIn: () => {}
        })
      }));
    });

    it("should render SubformTraces component", () => {
      expect(component.find(SubformTraces)).to.have.lengthOf(1);
    });
  });

  describe("when is isViolation ", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(SubformItem, {
        ...props,
        isViolation: true,
        field: FieldRecord({
          name: "killing",
          subform_section_id: FormSectionRecord({
            unique_id: "killing",
            fields: [
              FieldRecord({
                name: "killing_number_of_victims",
                visible: true,
                type: "text_field"
              })
            ]
          })
        }),
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
        violationOptions: [{ id: 1, display_text: "test" }],
        isViolationAssociation: true,
        parentTitle: "Parent Title"
      }));
    });

    it("should render SubformDialog component", () => {
      expect(component.find(SubformDialog)).to.have.lengthOf(1);
    });

    it("should render SubformDrawer component", () => {
      expect(component.find(SubformDrawer)).to.have.lengthOf(1);
    });

    it("renders SubformDialog component with valid props", () => {
      const componentsProps = { ...component.find(SubformItem).props() };

      [
        "arrayHelpers",
        "dialogIsNew",
        "field",
        "formik",
        "forms",
        "formSection",
        "index",
        "isDisabled",
        "isTraces",
        "isReadWriteForm",
        "isViolation",
        "isViolationAssociation",
        "mode",
        "selectedValue",
        "open",
        "orderedValues",
        "recordModuleID",
        "recordType",
        "setOpen",
        "title",
        "parentTitle",
        "violationOptions"
      ].forEach(property => {
        expect(componentsProps).to.have.property(property);
        delete componentsProps[property];
      });

      expect(componentsProps).to.be.empty;
    });
  });
});
