import { setupMountedComponent } from "../../../../../test";
import { FieldRecord, FormSectionRecord } from "../../../records";
import SubformDialog from "../subform-dialog";

import SubformFieldArray from "./component";

describe("<SubformFieldArray />", () => {
  const props = {
    arrayHelpers: {},
    form: {
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
      displayName: { 'en': "Family Details" },
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
    formik: {
      values: {
        family_details_section: [
          { relation_name: "father", relation_child_is_in_contac: "test A" },
          { relation_name: "aut", relation_child_is_in_contac: "test B" }
        ]
      },
      errors: { services_subform_section: [{ relation_name: "required" }] }
    },
    i18n: { t: value => value, locale: "en" },
    initialSubformValue: {
      relation_name: "",
      relation_child_is_in_contact: ""
    },
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
    ({ component } = setupMountedComponent(
      SubformFieldArray,
      props,
      {},
      [],
      formProps
    ));
  });

  it("render the subform", () => {
    expect(component.find(SubformFieldArray)).lengthOf(1);
  });

  it("renders the SubformDialog", () => {
    expect(component.find(SubformDialog)).lengthOf(1);
  });
});
