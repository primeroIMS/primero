import { fromJS, OrderedMap } from "immutable";
import { expect } from "chai";

import { PageContent, PageHeading } from "../page";
import { setupMountedComponent } from "../../test";
import { ACTIONS } from "../../libs/permissions";
import { PrimeroModuleRecord } from "../application/records";
import { FormSectionRecord, FieldRecord } from "../form/records";
import Form from "../form";
import SelectInput from "../form/fields/select-input";

import ReportsForm from "./container";

describe("<ReportsForm /> - Container", () => {
  let component;

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
    ({ component } = setupMountedComponent(ReportsForm, { mode: "new" }, initialState));
  });

  it("should render <PageHeading>", () => {
    expect(component.find(PageHeading)).to.have.lengthOf(1);
  });

  it("should render <PageContent>", () => {
    expect(component.find(PageContent)).to.have.lengthOf(1);
  });

  it.skip("does not render date fields in the aggregate/disaggreate select fields", () => {
    component.find(SelectInput).at(0).find("button").at(1).simulate("click");
    component.find(SelectInput).at(0).find("ul.MuiAutocomplete-groupUl").at(0).find("li").at(0).simulate("click");

    component.find(SelectInput).at(1).find("button").at(1).simulate("click");
    component.find(SelectInput).at(1).find("ul.MuiAutocomplete-groupUl").at(0).find("li").at(0).simulate("click");

    expect(
      component
        .find(SelectInput)
        .at(2)
        .props()
        .options.map(option => option.id)
    ).to.deep.equals(["cp_some_field"]);
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
