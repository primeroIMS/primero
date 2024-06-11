// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, OrderedMap } from "immutable";

import { ACTIONS } from "../../../permissions";
import { FormSectionRecord, FieldRecord } from "../../../record-form/records";
import { mountedComponent, screen } from "../../../../test-utils";

import ReportFiltersDialog from "./component";

describe("<ReportFiltersDialog /> - Component", () => {
  const forms = {
    formSections: OrderedMap({
      1: FormSectionRecord({
        id: 1,
        unique_id: "incident_details_subform_section",
        name: { en: "Nested Incident Details Subform" },
        visible: false,
        fields: [2]
      }),
      2: FormSectionRecord({
        id: 2,
        unique_id: "incident_details_container",
        name: { en: "Incident Details" },
        visible: true,
        parent_form: "case",
        fields: [1]
      })
    }),
    fields: OrderedMap({
      1: FieldRecord({
        name: "incident_details",
        type: "subform"
      }),
      2: FieldRecord({
        name: "cp_incident_location_type_other",
        type: "text_field"
      })
    })
  };

  const props = {
    fields: [
      {
        id: "test_numeric_field",
        display_text: "Test numeric field",
        formSection: "Test form section",
        type: "numeric_field",
        option_strings_source: undefined,
        option_strings_text: null,
        tick_box_label: undefined
      }
    ],
    open: true,
    setOpen: () => {},
    selectedIndex: "0",
    setSelectedIndex: () => {},
    indexes: [
      {
        index: 0,
        data: { attribute: "test_numeric_field", constraint: "=", value: "10" }
      }
    ],
    onSuccess: () => {}
  };

  const initialState = fromJS({
    user: {
      permissions: {
        reports: [ACTIONS.MANAGE]
      }
    },
    forms,
    application: {
      ageRanges: {
        primero: ["0..5", "6..11", "12..17", "18..999"]
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<ReportFiltersDialog {...props} />, initialState);
  });

  it("should render <ActionDialog>", () => {
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should render <FormSectionField>", () => {
    expect(screen.getAllByTestId("form-section-field")).toHaveLength(3);
  });

  describe("should render SelectField in <FormSectionField>", () => {
    const options = [
      {
        id: "test_1",
        display_text: {
          en: "Test 1"
        }
      },
      {
        id: "test_2",
        display_text: {
          en: "Test 2"
        }
      }
    ];
    const newProps = {
      fields: [
        {
          id: "test_select_field",
          display_text: "Test Select Field",
          formSection: "Test form section",
          type: "select_box",
          option_strings_source: undefined,
          option_strings_text: options,
          tick_box_label: undefined
        }
      ],
      open: true,
      setOpen: () => {},
      selectedIndex: "0",
      setSelectedIndex: () => {},
      indexes: [
        {
          index: 0,
          data: { attribute: "test_select_field", constraint: true, value: [] }
        }
      ],
      onSuccess: () => {}
    };

    beforeEach(() => {
      mountedComponent(<ReportFiltersDialog {...newProps} />, initialState);
    });

    describe("<FormSectionField> - SelectField", () => {
      // No longer have a good way to check select options
      it.todo("renders selectField with options");
    });
  });
});
