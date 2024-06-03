import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../test-utils";
import { FieldRecord, FormSectionRecord } from "../../../records";

import SubformItem from "./component";

describe("<SubformItem />", () => {
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

  it("should render SubformItem component", () => {
    mountedComponent(<SubformItem {...props} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  describe("when is isTraces ", () => {
    it("should render SubformTraces component", () => {
      mountedComponent(
        <SubformItem
          {...{
            ...props,
            isTraces: true,
            mode: { isShow: true },
            formSection: FormSectionRecord({
              fields: [],
              setIn: () => {}
            })
          }}
        />
      );

      expect(screen.getByText("tracing_request.traces")).toBeInTheDocument();
    });
  });

  describe("when is isViolation ", () => {
    beforeEach(() => {
      mountedComponent(
        <SubformItem
          {...{
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
          }}
        />
      );
    });

    it("should render SubformDialog component", () => {
      expect(screen.getByTestId("subForm-dialog-form")).toBeInTheDocument();
    });

    it("should render SubformDrawer component", () => {
      expect(screen.getByTestId("drawer")).toBeInTheDocument();
    });
  });
});
