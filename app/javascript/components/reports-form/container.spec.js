import { fromJS, OrderedMap } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../permissions";
import { PrimeroModuleRecord } from "../application/records";
import { FormSectionRecord, FieldRecord } from "../form/records";

import ReportsForm from "./container";

describe("<ReportsForm /> - Container", () => {
  const primeroModule = PrimeroModuleRecord({
    unique_id: "module_1",
    associated_record_types: ["case"],
    name: "Module 1"
  });

  const forms = {
    formSections: OrderedMap({
      1: FormSectionRecord({
        id: 1,
        unique_id: "incident_details_subform_section",
        name: { en: "Nested Incident Details Subform" },
        is_nested: true,
        visible: false,
        fields: [2]
      }),
      2: FormSectionRecord({
        id: 2,
        unique_id: "incident_details_container",
        name: { en: "Incident Details" },
        visible: true,
        parent_form: "case",
        is_nested: false,
        fields: [1],
        module_ids: ["module_1"]
      }),
      3: FormSectionRecord({
        id: 3,
        unique_id: "form_1",
        name: { en: "Form 1" },
        visible: true,
        parent_form: "case",
        is_nested: false,
        fields: [3, 5],
        module_ids: ["module_1"]
      })
    }),
    fields: OrderedMap({
      1: FieldRecord({
        name: "incident_details",
        type: "subform",
        visible: true
      }),
      2: FieldRecord({
        name: "cp_incident_location_type_other",
        type: "text_field",
        visible: true
      }),
      3: FieldRecord({
        name: "cp_create_date",
        type: "date_field",
        visible: true
      }),
      4: FieldRecord({
        name: "status",
        type: "text_field",
        visible: true
      }),
      5: FieldRecord({
        name: "cp_some_field",
        type: "select_box",
        visible: true
      })
    })
  };

  const initialState = fromJS({
    user: {
      modules: ["module_1"],
      permissions: {
        reports: [ACTIONS.MANAGE]
      },
      permittedForms: {
        incident_details_container: "rw",
        form_1: "rw"
      }
    },
    forms,
    application: {
      modules: [primeroModule],
      ageRanges: {
        primero: ["0..5", "6..11", "12..17", "18..999"]
      }
    }
  });

  beforeEach(() => {
    const props = { mode: "new" };

    mountedComponent(<ReportsForm {...props} />, initialState);
    // ({ component } = setupMountedComponent(ReportsForm, { mode: "new" }, initialState));
  });

  it("should render <PageHeading>", () => {
    expect(screen.getByText("reports.register_new_report")).toBeInTheDocument();
  });

  it("should render <PageContent>", () => {
    expect(screen.getByText("reports.translations.manage")).toBeInTheDocument();
  });
});
