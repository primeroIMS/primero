import { expect, setupMountedComponent } from "../../../../../test";
import { FieldRecord, FormSectionRecord } from "../../../records";
import FormSectionField from "../../form-section-field";
import TextField from "../../field-types/text-field";

import ServicesSubform from "./component";

describe("<ServicesSubform />", () => {
  const props = {
    field: FieldRecord({
      name: "services_section",
      subform_section_id: FormSectionRecord({
        fields: [
          FieldRecord({
            name: "service_implementing_agency",
            visible: true,
            option_strings_source: "Agency"
          }),
          FieldRecord({
            name: "service_implementing_agency_individual",
            visible: true,
            option_strings_source: "User"
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
    index: 0
  };

  const formProps = {
    initialValues: {
      service_implementing_agency: "",
      service_implementing_agency_individual: ""
    }
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      ServicesSubform,
      props,
      {},
      [],
      formProps
    ));
  });

  it("renders the subform", () => {
    expect(component.find(FormSectionField)).lengthOf(2);
  });

  describe("when field is visible should not be render", () => {
    const propsFieldNotVisible = {
      field: FieldRecord({
        name: "services_section",
        subform_section_id: FormSectionRecord({
          fields: [
            FieldRecord({
              name: "service_implementing_agency",
              option_strings_source: "Agency",
              visible: true
            }),
            FieldRecord({
              name: "service_implementing_agency_individual",
              option_strings_source: "User",
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
      index: 0
    };

    const visibleFieldFormProps = {
      initialValues: {
        service_implementing_agency: "",
        service_implementing_agency_individual: ""
      }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        ServicesSubform,
        propsFieldNotVisible,
        {},
        [],
        visibleFieldFormProps
      ));
    });

    it("renders the subform", () => {
      expect(component.find(TextField)).lengthOf(1);
    });
  });
});
