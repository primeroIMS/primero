import { expect, setupMountedComponent } from "../../../../../test";
import { FieldRecord, FormSectionRecord } from "../../../records";
import TextField from "../../field-types/text-field";

import SubformDialog from "./component";

describe("<SubformDialog />", () => {
  const props = {
    dialogIsNew: true,
    field: FieldRecord({
      name: "services_section",
      subform_section_id: FormSectionRecord({
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
      values: []
    },
    mode: {
      isShow: true
    },
    index: 0,
    i18n: {},
    open: true,
    setOpen: () => {},
    title: "Family details"
  };

  const formProps = {
    initialValues: {
      relation_name: "",
      relation_child_is_in_contact: ""
    }
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      SubformDialog,
      props,
      {},
      [],
      formProps
    ));
  });

  it("render the subform", () => {
    expect(component.find(SubformDialog)).lengthOf(1);
  });

  it("renders the FormSectionField", () => {
    expect(component.find(TextField)).lengthOf(2);
  });

  describe("when field is visible should not be render", () => {
    const propsFieldNotVisible = {
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
      index: 0,
      i18n: {},
      open: true,
      setOpen: () => {},
      title: "Family details"
    };

    const visibleFieldFormProps = {
      initialValues: {
        relation_name: "",
        relation_child_is_in_contact: ""
      }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        SubformDialog,
        propsFieldNotVisible,
        {},
        [],
        visibleFieldFormProps
      ));
    });

    it("render the subform", () => {
      expect(component.find(SubformDialog)).lengthOf(1);
    });

    it("renders the visible FormSectionField", () => {
      expect(component.find(TextField)).lengthOf(1);
    });
  });
});
