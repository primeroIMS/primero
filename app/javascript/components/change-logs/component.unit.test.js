import { fromJS, List, Map, OrderedMap } from "immutable";
import Timeline from "@material-ui/lab/Timeline";

import { setupMountedComponent } from "../../../test";
import ActionDialog from "../../action-dialog";
import { FieldRecord } from "../../record-form";

import ChangeLogs from "./component";
import { ChangeLogsRecord } from "./records";
import ChangeLogItem from "./components/change-log-item";

describe("ChangeLogs - Component", () => {
  let component;
  const props = {
    close: () => {},
    openChangeLog: true,
    record: fromJS({
      id: "38c82975-99aa-4798-9c3d-dabea104d992",
      nationality: ["canada", "australia"]
    }),
    recordType: "cases"
  };
  const defaultState = Map({
    records: Map({
      changeLogs: Map({
        data: List([
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
              { national_id_no: { to: "0050M", from: null } }
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
        ])
      })
    }),
    forms: Map({
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
        })
      })
    })
  });

  before(() => {
    component = setupMountedComponent(ChangeLogs, props, defaultState).component;
  });

  it("renders ChangeLogs", () => {
    expect(component.find(ChangeLogs)).to.have.lengthOf(1);
  });

  it("renders ActionDialog", () => {
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("renders Timeline", () => {
    expect(component.find(Timeline)).to.have.lengthOf(1);
  });

  it("renders ChangeLogItem", () => {
    expect(component.find(ChangeLogItem)).to.have.lengthOf(4);
  });
});
