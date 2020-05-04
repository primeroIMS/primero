import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { mapEntriesToRecord } from "../../../../libs";
import { FormSectionRecord } from "../../../record-form/records";
import { RECORD_TYPES } from "../../../../config/constants";

import FormsList from "./component";
import FormFilters from "./components/form-filters";
import FormGroup from "./components/form-group";

describe("<FormsList />", () => {
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
    application: {
      modules: [
        {
          unique_id: "primeromodule-cp",
          name: "CP",
          associated_record_types: [
            RECORD_TYPES.cases,
            RECORD_TYPES.tracing_requests,
            RECORD_TYPES.incidents
          ]
        }
      ]
    },
    records: {
      admin: {
        forms: {
          formSections: mapEntriesToRecord(
            formSections,
            FormSectionRecord,
            true
          )
        }
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(FormsList, {}, initialState));
  });

  it("renders <PageHeading />", () => {
    expect(component.find("header h1").text()).to.equal("forms.label");
  });

  it("renders <FormFilters />", () => {
    expect(component.find(FormFilters)).to.have.lengthOf(1);
  });

  it("renders form sections", () => {
    expect(component.find(FormGroup)).to.have.lengthOf(2);
  });
});
