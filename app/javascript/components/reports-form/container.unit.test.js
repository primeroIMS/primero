import { fromJS, OrderedMap } from "immutable";

import { PageContent, PageHeading } from "../page";
import { setupMountedComponent } from "../../test";
import { ACTIONS } from "../../libs/permissions";
import { FormSectionRecord, FieldRecord } from "../record-form/records";
import Form from "../form";

import ReportsForm from "./container";

describe("<ReportsForm /> - Container", () => {
  let component;

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
    ({ component } = setupMountedComponent(ReportsForm, { mode: "new" }, initialState));
  });

  it("should render <PageHeading>", () => {
    expect(component.find(PageHeading)).to.have.lengthOf(1);
  });

  it("should render <PageContent>", () => {
    expect(component.find(PageContent)).to.have.lengthOf(1);
  });

  it("should contain valid props for <Form> component", () => {
    const props = Object.keys(component.find(Form).props());
    const expected = [
      "initialValues",
      "formSections",
      "onSubmit",
      "formMode",
      "validations",
      "formID",
      "registerFields",
      "submitAllFields",
      "submitAlways",
      "renderBottom",
      "formErrors",
      "formOptions",
      "mode",
      "useCancelPrompt"
    ];

    expect(props).to.deep.equals(expected);
  });
});
