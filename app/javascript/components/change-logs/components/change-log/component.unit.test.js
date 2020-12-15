import { fromJS, OrderedMap } from "immutable";
import Timeline from "@material-ui/lab/Timeline";

import { setupMountedComponent } from "../../../../test";
import { FieldRecord } from "../../../record-form";
import { ChangeLogsRecord } from "../../records";
import ChangeLogItem from "../change-log-item";

import ChangeLog from "./component";

describe("ChangeLog - Component", () => {
  let component;

  const allFields = OrderedMap({
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
  });

  const allLookups = fromJS([
    {
      id: 2,
      unique_id: "lookup-country",
      name: {
        en: "country",
        values: [
          {
            id: "country_1",
            display_text: {
              en: "Country 1"
            }
          },
          {
            id: "country_2",
            display_text: {
              en: "Country 2"
            }
          }
        ]
      }
    }
  ]);

  const props = {
    allFields,
    allLookups,
    locations: {},
    recordChangeLogs: fromJS([
      ChangeLogsRecord({
        record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
        record_type: "cases",
        datetime: "2020-08-11T10:27:33Z",
        user_name: "primero",
        action: "update",
        record_changes: [
          {
            nationality: { to: ["country_1", "country_2"], from: ["country_1"] }
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
    ]),
    setCalculatingChangeLog: () => {},
    setOpen: () => {},
    setRecordChanges: () => {}
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(ChangeLog, props, {}));
  });

  it("renders ChangeLog", () => {
    expect(component.find(ChangeLog)).to.have.lengthOf(1);
  });

  it("renders Timeline", () => {
    expect(component.find(Timeline)).to.have.lengthOf(1);
  });

  it("renders ChangeLogItem", () => {
    expect(component.find(ChangeLogItem)).to.have.lengthOf(4);
  });
});
