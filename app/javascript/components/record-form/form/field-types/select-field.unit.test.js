import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { whichFormMode } from "../../../form";
import SearchableSelect from "../../../searchable-select";
import { CUSTOM_STRINGS_SOURCE } from "../constants";

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
      forms: {
        options: {
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
      }
    });

    const { component } = setupMountedComponent(
      SelectField,
      props,
      initialState,
      [],
      { initialValues: { agency: "agency-test-1" } }
    );

    it("render the select field with options", () => {
      const expected = [{ value: "agency-test-1" }, { value: "agency-test-2" }];
      const selectField = component.find(SelectField);
      const searchableSelect = selectField.find(SearchableSelect);

      expect(searchableSelect).to.have.lengthOf(1);
      expect(searchableSelect.props().options).to.deep.equal(expected);
    });
  });
});
