import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { whichFormMode } from "../../../form";
import SearchableSelect from "../../../searchable-select";
import { CUSTOM_STRINGS_SOURCE } from "../constants";
import { SERVICE_SECTION_FIELDS } from "../../../record-actions/transitions/components/referrals";

import SelectField from "./select-field";

describe("<SelectField />", () => {
  context("when the lookup is custom", () => {
    const props = {
      name: "agency",
      field: {
        option_strings_source: CUSTOM_STRINGS_SOURCE.agency
      },
      label: "Agency",
      mode: whichFormMode("edit"),
      open: true
    };

    const initialState = fromJS({
      application: {
        agencies: [
          {
            unique_id: "agency-test-1",
            agency_code: "test1",
            disabled: false,
            services: ["service_test_1"]
          },
          {
            unique_id: "agency-test-2",
            agency_code: "test2",
            disabled: false,
            services: ["service_test_1", "service_test_2"]
          }
        ]
      }
    });

    const { component } = setupMountedComponent(SelectField, props, initialState, [], {
      initialValues: { agency: "agency-test-1" }
    });

    it("render the select field with options", () => {
      const expected = [{ value: "agency-test-1" }, { value: "agency-test-2" }];
      const selectField = component.find(SelectField);
      const searchableSelect = selectField.find(SearchableSelect);

      expect(searchableSelect).to.have.lengthOf(1);
      expect(searchableSelect.props().options).to.deep.equal(expected);
    });
  });
  context("when is service_type", () => {
    const props = {
      name: SERVICE_SECTION_FIELDS.type,
      field: {
        option_strings_source: "lookup lookup-service-type"
      },
      label: "Type of Service",
      mode: whichFormMode("edit"),
      open: true
    };

    const initialState = fromJS({
      forms: {
        options: {
          lookups: {
            data: [
              {
                id: 20,
                unique_id: "lookup-service-type",
                name: {
                  en: "Service Type"
                },
                values: [
                  {
                    id: "health_medical_service",
                    disabled: false,
                    display_text: {
                      en: "Health/Medical Service"
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    });

    const { component } = setupMountedComponent(SelectField, props, initialState, [], {
      initialValues: {
        service_type: "health_medical_service"
      }
    });

    it("render the select field with options", () => {
      const expected = [{ label: "Health/Medical Service", isDisabled: false, value: "health_medical_service" }];

      const selectField = component.find(SelectField);
      const searchableSelect = selectField.find(SearchableSelect);

      expect(searchableSelect).to.have.lengthOf(1);
      expect(searchableSelect.props().options).to.deep.equal(expected);
    });
  });

  context("when a disabled value is selected", () => {
    const props = {
      name: SERVICE_SECTION_FIELDS.type,
      field: {
        option_strings_text: [
          { id: "test1", display_text: "Test 1" },
          { id: "test2", disabled: true, display_text: "Test 2" },
          { id: "test3", display_text: "Test 3" },
          { id: "test4", disabled: true, display_text: "Test 4" }
        ]
      },
      label: "Type of Service",
      mode: whichFormMode("edit"),
      open: true
    };

    const { component } = setupMountedComponent(SelectField, props, {}, [], {
      initialValues: {
        service_type: "test2"
      }
    });

    it("render the select field with options included the disabled selected", () => {
      const selectField = component.find(SelectField);
      const searchableSelect = selectField.find(SearchableSelect);

      expect(searchableSelect).to.have.lengthOf(1);
      expect(searchableSelect.props().options).to.have.lengthOf(3);
    });
  });
});
