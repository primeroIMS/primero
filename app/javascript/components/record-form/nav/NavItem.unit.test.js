import { fromJS, Map, OrderedMap } from "immutable";
import { ListItem, ListItemText } from "@material-ui/core";

import { setupMountedComponent, expect } from "../../../test";
import { FormSectionRecord, FieldRecord } from "../records";

import NavItem from "./NavItem";

describe("<NavItem />", () => {
  let component;

  const record = fromJS({
    case_id: "12345",
    case_id_display: "3c9d076",
    date_of_birth: "2015-01-06",
    id: "1d8d84eb-25e3-4d8b-8c32-8452eee3e71c",
    module_id: "primeromodule-cp",
    name_first: "example",
    name_last: "case",
    owned_by: "primero",
    previously_owned_by: "primero",
    record_state: true,
    registration_date: "2020-01-06",
    sex: "male",
    short_id: "3c9d076",
    status: "open"
  });

  const formSections = OrderedMap({
    1: FormSectionRecord({
      id: 1,
      form_group_id: "basic_identity",
      form_group_name: {
        en: "Basic Identity",
        fr: "",
        ar: ""
      },
      order_form_group: 30,
      name: {
        en: "Basic Identity",
        fr: "",
        ar: ""
      },
      order: 10,
      unique_id: "basic_identity",
      is_first_tab: true,
      visible: true,
      is_nested: false,
      module_ids: ["primeromodule-cp"],
      parent_form: "case",
      fields: [1]
    })
  });

  const fields = OrderedMap({
    1: FieldRecord({
      id: 1,
      name: "name_first",
      type: "text_field",
      editable: true,
      disabled: null,
      visible: true,
      display_name: {
        en: "First Name",
        fr: "",
        ar: "",
        "ar-LB": "",
        so: "",
        es: ""
      },
      subform_section_id: null,
      help_text: {},
      multi_select: null,
      option_strings_source: null,
      option_strings_text: null,
      guiding_questions: "",
      required: true
    })
  });

  const initialState = Map({
    records: fromJS({
      cases: {
        data: [record]
      }
    }),
    forms: fromJS({
      selectedForm: "record_owner",
      selectedRecord: "1d8d84eb-25e3-4d8b-8c32-8452eee3e71c",
      formSections,
      fields,
      loading: false,
      errors: false
    })
  });

  const props = {
    form: {},
    groupItem: false,
    handleClick: () => {},
    isNested: false,
    isNew: false,
    itemsOfGroup: [],
    name: "",
    open: false,
    recordAlerts: {},
    selectedForm: ""
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(NavItem, props, initialState));
  });

  it("renders a ListItem component />", () => {
    expect(component.find(ListItem)).to.have.lengthOf(1);
  });

  it("renders a ListItemText component />", () => {
    expect(component.find(ListItemText)).to.have.lengthOf(1);
  });

  it("should render valid props", () => {
    const NavItemProps = { ...component.find(NavItem).props() };

    expect(component.find(NavItem)).to.have.lengthOf(1);
    [
      "form",
      "groupItem",
      "handleClick",
      "isNested",
      "isNew",
      "itemsOfGroup",
      "name",
      "open",
      "recordAlerts",
      "selectedForm"
    ].forEach(property => {
      expect(NavItemProps).to.have.property(property);
      delete NavItemProps[property];
    });
    expect(NavItemProps).to.be.empty;
  });
});
