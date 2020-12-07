import { fromJS, OrderedMap } from "immutable";
import Timeline from "@material-ui/lab/Timeline";

import { setupMountedComponent } from "../../../../test";
import { FieldRecord } from "../../../record-form";
import ActionDialog from "../../../action-dialog";
import ChangeLogItem from "../change-log-item";

import SubformDialog from "./component";

describe("SubformDialog - Component", () => {
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
    recordChanges: {
      value: {
        to: [
          {
            relation: "mother",
            unique_id: "57d99a69-acbc-4b7e-850b-9e873181a778",
            relation_name: "AaAa",
            relation_is_alive: "alive"
          },
          {
            relation: "father",
            unique_id: "c29598ad-b920-4166-bb99-fe7a2443601b",
            relation_name: "bbb",
            relation_is_alive: "alive"
          }
        ],
        from: [
          {
            relation: "mother",
            unique_id: "57d99a69-acbc-4b7e-850b-9e873181a778",
            relation_name: "AaAA",
            relation_is_alive: "alive"
          }
        ]
      },
      subformName: "Family Details",
      commonProps: {
        date: "2020-12-07T20:28:11Z",
        user: "primero"
      }
    },
    open: true,
    calculatingChangeLog: false,
    setCalculatingChangeLog: () => {},
    setOpen: () => {}
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(SubformDialog, props, {}));
  });

  it("renders SubformDialog", () => {
    expect(component.find(SubformDialog)).to.have.lengthOf(1);
  });

  it("renders ActionDialog", () => {
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("renders Timeline", () => {
    expect(component.find(Timeline)).to.have.lengthOf(1);
  });

  it("renders ChangeLogItem", () => {
    expect(component.find(ChangeLogItem)).to.have.lengthOf(2);
  });
});
