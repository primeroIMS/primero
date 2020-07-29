import { fromJS, Map, OrderedMap } from "immutable";
import Divider from "@material-ui/core/Divider";
import CloseIcon from "@material-ui/icons/Close";

import { setupMountedComponent } from "../../../test";
import { FormSectionRecord, FieldRecord } from "../records";
import { ConditionalWrapper } from "../../../libs";
import Actions from "../actions";

import { NavGroup, RecordInformation } from "./components";
import Nav from "./component";

describe("<Nav />", () => {
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
    }),
    2: FormSectionRecord({
      id: 2,
      form_group_id: "record_information",
      form_group_name: {
        en: "Record information",
        fr: "",
        ar: ""
      },
      order_form_group: 30,
      name: {
        en: "Record information",
        fr: "",
        ar: ""
      },
      order: 10,
      unique_id: "record_owner",
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

  const formNav = OrderedMap({
    1: OrderedMap({
      1: {
        group: "basic_identity",
        groupName: "Basic Identity",
        groupOrder: 9,
        name: "Basic Identity",
        order: 9,
        formId: "basic_identity",
        is_first_tab: true
      }
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
    firstTab: {},
    formNav,
    handleToggleNav: () => {},
    isNew: false,
    mobileDisplay: true,
    selectedForm: "record_owner",
    selectedRecord: "1d8d84eb-25e3-4d8b-8c32-8452eee3e71c",
    toggleNav: true,
    recordType: "cases",
    primeroModule: "primeromodule-cp"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(Nav, props, initialState));
  });

  it("renders a CloseIcon component />", () => {
    expect(component.find(CloseIcon)).to.have.lengthOf(1);
  });

  it("renders a Nav component />", () => {
    expect(component.find(Nav)).to.have.lengthOf(1);
  });

  it("renders a RecordInformation component />", () => {
    expect(component.find(RecordInformation)).to.have.lengthOf(1);
  });

  it("renders a Divider component />", () => {
    expect(component.find(Divider)).to.have.lengthOf(1);
  });

  it("renders a NavGroup component from record information and another one from the others forms groups />", () => {
    expect(component.find(NavGroup)).to.have.lengthOf(2);
  });

  it("renders the NavGroup component for record information open", () => {
    expect(component.find(NavGroup).first().props().open).to.equal(
      "record_information"
    );
  });

  it("renders a ConditionalWrapper />", () => {
    expect(component.find(ConditionalWrapper)).to.have.lengthOf(1);
  });

  it("should render valid props", () => {
    const navProps = { ...component.find(Nav).props() };

    expect(component.find(Nav)).to.have.lengthOf(1);
    [
      "firstTab",
      "formNav",
      "handleToggleNav",
      "isNew",
      "mobileDisplay",
      "primeroModule",
      "recordType",
      "selectedForm",
      "selectedRecord",
      "toggleNav"
    ].forEach(property => {
      expect(navProps).to.have.property(property);
      delete navProps[property];
    });
    expect(navProps).to.be.empty;
  });

  describe("when the selected record is not the current record", () => {
    const notSelectedProps = {
      ...props,
      firstTab: { unique_id: "basic_identity" },
      selectedRecord: ""
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Nav,
        notSelectedProps,
        initialState
      ));
    });

    it("sets the firstTab as selectedForm", () => {
      const expectedAction = {
        type: Actions.SET_SELECTED_FORM,
        payload: "basic_identity"
      };

      const setAction = component
        .props()
        .store.getActions()
        .find(action => action.type === Actions.SET_SELECTED_FORM);

      expect(setAction).to.deep.equal(expectedAction);
    });
  });

  describe("when clicking a formGroup", () => {
    const formNavWithGroups = OrderedMap({
      1: OrderedMap({
        1: {
          formId: "basic_identity",
          group: "identification_registration",
          groupName: "Identification / Registration",
          groupOrder: 30,
          is_first_tab: true,
          name: "Basic Identity",
          order: 10,
          permission_actions: []
        },
        2: {
          formId: "incident_details_container",
          group: "identification_registration",
          groupName: "Identification / Registration",
          groupOrder: 30,
          is_first_tab: false,
          name: "Incident Details",
          order: 0,
          permission_actions: []
        }
      }),
      2: OrderedMap({
        3: {
          formId: "family_details",
          group: "family_partner_details",
          groupName: "Family / Partner Details",
          groupOrder: 50,
          is_first_tab: false,
          name: "Family Details",
          order: 10,
          permission_actions: []
        },
        4: {
          formId: "partner_details",
          group: "family_partner_details",
          groupName: "Family / Partner Details",
          groupOrder: 50,
          is_first_tab: false,
          name: "Partner/Spouse Details",
          order: 20,
          permission_actions: []
        }
      })
    });
    const navGroupProps = {
      formNav: formNavWithGroups,
      firstTab: {},
      handleToggleNav: () => {},
      isNew: true,
      mobileDisplay: false,
      selectedForm: "basic_identity",
      selectedRecord: "1d8d84eb-25e3-4d8b-8c32-8452eee3e71c",
      toggleNav: true,
      recordType: "cases",
      primeroModule: "primeromodule-cp"
    };

    it("should select first form of the form group", () => {
      const { component: navComponent } = setupMountedComponent(
        Nav,
        navGroupProps,
        initialState
      );
      const registrationGroup = navComponent.find(".MuiListItem-gutters").at(3);

      expect(registrationGroup.text()).to.be.equal(
        "Identification / Registration"
      );

      registrationGroup.simulate("click");
      expect(navComponent.find(".Mui-selected").at(0).text()).to.be.equal(
        "Basic Identity"
      );
    });
  });
});
