import { expect, setupMountedComponent } from "../../../../../test";
import { FieldRecord, FormSectionRecord } from "../../../records";
import FormSectionField from "../../form-section-field";

import ServicesSubform from "./component";

describe("<ServicesSubform />", () => {
  const props = {
    field: FieldRecord({
      name: "services_section",
      subform_section_id: FormSectionRecord({
        fields: [
          FieldRecord({
            name: "service_implementing_agency",
            option_strings_source: "Agency"
          }),
          FieldRecord({
            name: "service_implementing_agency_individual",
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

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(ServicesSubform, props, {}));
  });

  it("renders the subform", () => {
    expect(component.find(FormSectionField)).lengthOf(2);
  });
});
