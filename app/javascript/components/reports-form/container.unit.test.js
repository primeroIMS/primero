import { fromJS } from "immutable";
import { FormContext } from "react-hook-form";

import { PageContent, PageHeading } from "../page";
import { setupMountedComponent } from "../../test";
import { ACTIONS } from "../../libs/permissions";
import FormSection from "../form/components/form-section";
import { mapEntriesToRecord } from "../../libs";
import { FormSectionRecord } from "../record-form/records";

import ReportsForm from "./container";

describe("<ReportsForm /> - Container", () => {
  let component;

  const formSections = [
    {
      id: 1,
      unique_id: "form_section_1",
      parent_form: "case",
      module_ids: ["primeromodule-cp"],
      order: 1,
      form_group_id: "group_1",
      order_form_group: 2
    },
    {
      id: 2,
      unique_id: "form_section_2",
      parent_form: "case",
      module_ids: ["primeromodule-cp"],
      order: 2,
      form_group_id: "group_1",
      order_form_group: 2
    },
    {
      id: 5,
      unique_id: "form_section_5",
      parent_form: "case",
      module_ids: ["primeromodule-cp"],
      order: 1,
      form_group_id: "group_2",
      order_form_group: 1
    }
  ];

  const initialState = fromJS({
    user: {
      permissions: {
        reports: [ACTIONS.MANAGE]
      }
    },
    forms: {
      formSections: mapEntriesToRecord(formSections, FormSectionRecord, true)
    },
    application: {
      ageRanges: {
        primero: ["0..5", "6..11", "12..17", "18..999"]
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(ReportsForm, {}, initialState));
  });

  it("should render <PageHeading>", () => {
    expect(component.find(PageHeading)).to.have.lengthOf(1);
  });

  it("should render <PageContent>", () => {
    expect(component.find(PageContent)).to.have.lengthOf(1);
  });

  it("should render <FormContext>", () => {
    expect(component.find(FormContext)).to.have.lengthOf(1);
  });

  it("should render <FormSection>", () => {
    expect(component.find(FormSection)).to.have.lengthOf(1);
  });
});
