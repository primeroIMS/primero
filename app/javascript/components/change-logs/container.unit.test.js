import { fromJS, OrderedMap } from "immutable";
import Timeline from "@material-ui/lab/Timeline";

import { setupMountedComponent } from "../../test";
import { FieldRecord } from "../record-form";
import RecordFormTitle from "../record-form/form/record-form-title";

import ChangeLogs from "./container";
import { ChangeLogsRecord } from "./records";
import ChangeLog from "./components/change-log";
import ChangeLogItem from "./components/change-log-item";
import SubformDialog from "./components/subform-dialog";

describe("ChangeLogs - Container", () => {
  let component;
  const props = {
    handleToggleNav: () => {},
    mobileDisplay: false,
    recordID: "38c82975-99aa-4798-9c3d-dabea104d992",
    recordType: "cases",
    fetchable: true
  };
  const defaultState = fromJS({
    records: {
      changeLogs: {
        data: [
          ChangeLogsRecord({
            record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
            record_type: "cases",
            datetime: "2020-08-11T10:27:33Z",
            user_name: "primero",
            action: "update",
            record_changes: [
              {
                nationality: { to: ["canada", "australia"], from: ["canada"] }
              },
              { name_nickname: { to: "Pat", from: null } },
              { national_id_no: { to: "0050M", from: null } },
              {
                alleged_perpetrator: {
                  to: [
                    {
                      age_group: "12_17",
                      unique_id: "66df14a7-5382-44de-bc70-5a9633355bf4",
                      perpetrator_sex: "female",
                      former_perpetrator: false,
                      primary_perpetrator: "primary",
                      perpetrator_ethnicity: "ethnicity1",
                      perpetrator_occupation: "occupation_4",
                      perpetrator_nationality: "nationality2"
                    }
                  ],
                  from: null
                }
              }
            ]
          }),
          ChangeLogsRecord({
            record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
            record_type: "cases",
            datetime: "2020-08-10T18:27:33Z",
            user_name: "primero",
            action: "create",
            record_changes: []
          })
        ]
      }
    },
    forms: fromJS({
      fields: OrderedMap({
        0: FieldRecord({
          id: 1,
          name: "name_nickname",
          type: "text_field",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "Nickname"
          },
          subform_section_id: null,
          help_text: {},
          multi_select: null,
          option_strings_source: null,
          option_strings_text: null,
          guiding_questions: "",
          required: true,
          date_validation: "default_date_validation"
        }),
        1: FieldRecord({
          id: 1,
          name: "nationality",
          type: "select_box",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "Nationality"
          },
          subform_section_id: null,
          help_text: {},
          multi_select: null,
          option_strings_source: "lookup lookup-country",
          option_strings_text: null,
          guiding_questions: "",
          required: true,
          date_validation: "default_date_validation"
        }),
        2: FieldRecord({
          id: 1,
          name: "national_id_no",
          type: "text_field",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "National ID Number"
          },
          subform_section_id: null,
          help_text: {},
          multi_select: null,
          option_strings_source: null,
          option_strings_text: null,
          guiding_questions: "",
          required: true,
          date_validation: "default_date_validation"
        }),
        3: FieldRecord({
          id: 1,
          name: "alleged_perpetrator",
          type: "subform",
          editable: true,
          disabled: null,
          visible: true,
          display_name: {
            en: "Alleged Perpetrator"
          },
          subform_section_id: null,
          help_text: {},
          multi_select: null,
          option_strings_source: null,
          option_strings_text: null,
          guiding_questions: "",
          required: true,
          date_validation: "default_date_validation"
        })
      })
    })
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(ChangeLogs, props, defaultState, {}));
  });

  it("renders ChangeLogs", () => {
    expect(component.find(ChangeLogs)).to.have.lengthOf(1);
  });

  it("renders RecordFormTitle", () => {
    expect(component.find(RecordFormTitle)).to.have.lengthOf(1);
  });

  it("renders Timeline", () => {
    expect(component.find(Timeline)).to.have.lengthOf(1);
  });

  it("renders ChangeLog", () => {
    expect(component.find(ChangeLog)).to.have.lengthOf(1);
  });

  it("renders ChangeLogItem", () => {
    expect(component.find(ChangeLogItem)).to.have.lengthOf(5);
  });

  it("renders SubformDialog", () => {
    expect(component.find(SubformDialog)).to.have.lengthOf(1);
  });

  describe("when filters are selected", () => {
    it("renders only the selected field names", () => {
      const selectedForm = "changeLog";
      const { component: comp } = setupMountedComponent(
        ChangeLogs,
        { ...props, selectedForm },
        defaultState.setIn(["ui", "formFilters", selectedForm], fromJS({ field_names: ["nationality"] })),
        {}
      );

      expect(comp.find(ChangeLogItem)).to.have.lengthOf(1);
    });
  });
});
