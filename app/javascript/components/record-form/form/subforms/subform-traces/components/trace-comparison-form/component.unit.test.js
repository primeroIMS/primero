import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";

import {
  FormSectionRecord,
  FieldRecord,
  TEXT_FIELD,
  DATE_FIELD,
  NUMERIC_FIELD,
  SELECT_FIELD
} from "../../../../../../form";
import { RECORD_PATH, RECORD_TYPES } from "../../../../../../../config";
import { setupMountedComponent } from "../../../../../../../test";
import { FORMS } from "../../constants";
import FieldRow from "../field-row";

import TraceComparisonForm from "./component";

describe("<RecordForm>/form/subforms/<SubformTraces>/components/<TraceComparisonForm>", () => {
  let component;
  const recordModule = "record-module";
  const initialProps = {
    recordType: RECORD_PATH.tracing_requests,
    selectedForm: FORMS.comparison,
    traceValues: { matched_case_id: "0001" },
    setSelectedForm: () => {},
    potentialMatch: fromJS({
      trace: { id: "tr-1234-5678" },
      case: { case_id_display: "case123" },
      comparison: {
        case_to_trace: [
          { field_name: "name", case_value: "Person 1", trace_value: "Person 1", match: "match" },
          { field_name: "name_nickname", case_value: "", trace_value: "", match: "mismatch" },
          { field_name: "sex", case_value: "male", trace_value: "male", match: "match" },
          { field_name: "age", case_value: 10, trace_value: 10, match: "match" },
          { field_name: "date_of_birth", case_value: "2020-01-01", trace_value: "2020-01-01", match: "match" },
          { field_name: "field_1", case_value: "value 1", trace_value: "value 1", match: "match" },
          { field_name: "field_2", case_value: null, trace_value: "value 2", match: "mismatch" }
        ]
      }
    }),
    handleBack: () => {},
    handleConfirm: () => {},
    mode: { isEdit: false }
  };
  const initialState = fromJS({
    forms: {
      formSections: {
        "1": FormSectionRecord({
          id: 1,
          unique_id: "first_form",
          name: { en: "First Form" },
          description: { en: "First Form" },
          fields: [1, 2, 3, 4, 5, 6],
          module_ids: [recordModule],
          parent_form: RECORD_TYPES.cases,
          is_nested: false,
          order: 1,
          form_group_id: "group_1",
          order_form_group: 1,
          visible: true
        }),
        "2": FormSectionRecord({
          id: 2,
          unique_id: "second_form",
          name: { en: "Second Form" },
          description: { en: "Second Form" },
          fields: [7],
          module_ids: [recordModule],
          parent_form: RECORD_TYPES.cases,
          is_nested: false,
          order: 2,
          form_group_id: "group_1",
          order_form_group: 1,
          visible: true
        })
      },
      fields: {
        "1": FieldRecord({ id: 1, display_name: { en: "Name" }, name: "name", type: TEXT_FIELD }),
        "2": FieldRecord({ id: 2, display_name: { en: "Nickname" }, name: "name_nickname", type: TEXT_FIELD }),
        "3": FieldRecord({
          id: 3,
          display_name: { en: "Sex" },
          name: "sex",
          type: SELECT_FIELD,
          options_strings_source: "lookup lookup-gender"
        }),
        "4": FieldRecord({ id: 4, display_name: { en: "Age" }, name: "age", type: NUMERIC_FIELD }),
        "5": FieldRecord({ id: 5, display_name: { en: "Date of Birth" }, name: "date_of_birth", type: DATE_FIELD }),
        "6": FieldRecord({ id: 6, display_name: { en: "Field 1" }, name: "field_1", type: TEXT_FIELD }),
        "7": FieldRecord({ id: 7, display_name: { en: "Field 2" }, name: "field_2", type: TEXT_FIELD })
      },
      options: {
        lookups: [
          {
            id: 1,
            unique_id: "lookup-gender",
            name: { en: "Gender" },
            values: [
              { id: "male", display_text: { en: "Male" } },
              { id: "female", display_text: { en: "Female" } }
            ]
          }
        ]
      }
    },
    records: {
      tracing_requests: { data: [{ id: "trq-9876-5432", module_id: recordModule }] }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(TraceComparisonForm, initialProps, initialState));
  });

  it("should render the top fields", () => {
    expect(component.find(FieldRow).at(0).find(Grid).find("span").text()).to.equal("Name");
    expect(component.find(FieldRow).at(1).find(Grid).find("span").text()).to.equal("Nickname");
    expect(component.find(FieldRow).at(2).find(Grid).find("span").text()).to.equal("Sex");
    expect(component.find(FieldRow).at(3).find(Grid).find("span").text()).to.equal("Age");
    expect(component.find(FieldRow).at(4).find(Grid).find("span").text()).to.equal("Date of Birth");
  });

  it("should render the fields of those forms with comparison data", () => {
    expect(component.find(FieldRow).at(5).find(Grid).find("span").text()).to.equal("Name");
    expect(component.find(FieldRow).at(6).find(Grid).find("span").text()).to.equal("Nickname");
    expect(component.find(FieldRow).at(7).find(Grid).find("span").text()).to.equal("Sex");
    expect(component.find(FieldRow).at(8).find(Grid).find("span").text()).to.equal("Age");
    expect(component.find(FieldRow).at(9).find(Grid).find("span").text()).to.equal("Date of Birth");
    expect(component.find(FieldRow).at(10).find(Grid).find("span").text()).to.equal("Field 1");
  });

  it("should render not found for forms without comparison data", () => {
    expect(component.find("h2").at(3).text()).to.equal("Second Form");
    expect(component.find(Grid).find("span").at(13).text()).to.equal("tracing_request.messages.nothing_found");
  });

  it("should not render already matched message", () => {
    expect(
      component
        .find("div span")
        .map(elem => elem.text())
        .includes("tracing_request.messages.already_matched")
    ).to.be.false;
  });

  context("when the case has matched traces", () => {
    const stateWithMatchedTraces = initialState.setIn(
      ["records", "cases", "matchedTraces", "data"],
      fromJS([{ id: "123" }])
    );
    const { component: componentWithTraces } = setupMountedComponent(
      TraceComparisonForm,
      initialProps,
      stateWithMatchedTraces
    );

    it("should render already matched message", () => {
      expect(
        componentWithTraces
          .find("div span")
          .map(elem => elem.text())
          .includes("tracing_request.messages.already_matched")
      ).to.be.true;
    });
  });
});
