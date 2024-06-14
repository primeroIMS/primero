// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "../../../../../test-utils";
import { FieldRecord, FormSectionRecord } from "../../../records";
import subformDialogFields from "../subform-dialog-fields";

import ServicesSubform from "./component";

describe("<ServicesSubform />", () => {
  const props = {
    SubformDialogFields: subformDialogFields,
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
    index: 0,
    formSection: {}
  };

  const formProps = {
    initialValues: {
      service_implementing_agency: "",
      service_implementing_agency_individual: ""
    }
  };

  it("renders the subform", () => {
    mountedComponent(<ServicesSubform {...props} />, {}, [], {}, formProps);
    expect(screen.getAllByTestId("subform-dialog-field")).toHaveLength(2);
  });

  describe("when field is visible should not be render", () => {
    const propsFieldNotVisible = {
      SubformDialogFields: subformDialogFields,
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
      index: 0,
      form: {}
    };

    const visibleFieldFormProps = {
      initialValues: {
        service_implementing_agency: "",
        service_implementing_agency_individual: ""
      }
    };

    it("renders the subform", () => {
      mountedComponent(<ServicesSubform {...propsFieldNotVisible} />, {}, [], {}, visibleFieldFormProps);
      expect(screen.getAllByRole("textbox")).toHaveLength(1);
    });
  });
});
