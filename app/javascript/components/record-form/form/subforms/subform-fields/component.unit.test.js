import { setupMountedComponent } from "../../../../../test";
import { FieldRecord, FormSectionRecord } from "../../../records";

import SubformFields from "./component";

describe("<SubformFields />", () => {
  const props = {
    arrayHelpers: {},
    parentForm: {
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
      displayName: { en: "Family Details" },
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
      })
    }),
    locale: "en",
    setDialogIsNew: () => {},
    setOpen: () => {},
    i18n: { t: value => value, locale: "en" },
    values: [],
    mode: {
      isShow: true
    },
    recordType: "cases"
  };

  const formProps = {
    initialValues: {
      relation_name: "",
      relation_child_is_in_contact: ""
    }
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(SubformFields, props, {}, [], formProps));
  });

  it("render the SubformFields", () => {
    expect(component.find(SubformFields)).lengthOf(1);
  });
});
