import { fromJS, Map, OrderedMap } from "immutable";
import Divider from "@material-ui/core/Divider";
import CloseIcon from "@material-ui/icons/Close";

import { APPROVALS, INCIDENT_FROM_CASE, REFERRAL, RECORD_INFORMATION_GROUP } from "../../../config";
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
      errors: false,
      options: {
        lookups: [
          {
            id: 51,
            unique_id: "lookup-form-group-cp-case",
            name: {
              en: "Form Groups - CP Case"
            },
            values: [
              {
                id: "identification_registration",
                disabled: false,
                display_text: {
                  en: "Identification / Registration"
                }
              },
              {
                id: "family_partner_details",
                disabled: false,
                display_text: {
                  en: "Family / Partner Details"
                }
              },
              {
                id: "record_information",
                disabled: false,
                display_text: {
                  en: "Record Information"
                }
              }
            ]
          }
        ]
      }
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
    primeroModule: "primeromodule-cp",
    hasForms: true
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
    expect(component.find(NavGroup).first().props().open).to.equal("record_information");
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
      "toggleNav",
      "hasForms"
    ].forEach(property => {
      expect(navProps).to.have.property(property);
      delete navProps[property];
    });
    expect(navProps).to.be.empty;
  });

  describe("when is a new record", () => {
    const firstTab = { unique_id: "first_form", form_group_id: "first_group" };
    const notSelectedProps = {
      ...props,
      firstTab,
      selectedForm: "",
      isNew: true
    };

    it("sets the firstTab as selectedForm", () => {
      const { component: newComp } = setupMountedComponent(Nav, notSelectedProps, initialState);

      const expectedAction = {
        type: Actions.SET_SELECTED_FORM,
        payload: firstTab.unique_id
      };

      const setAction = newComp
        .props()
        .store.getActions()
        .find(action => action.type === Actions.SET_SELECTED_FORM);

      expect(setAction).to.deep.equal(expectedAction);
    });

    it("opens the form_group_id of the firstTab", () => {
      const { component: newComp } = setupMountedComponent(Nav, notSelectedProps, initialState);
      const navGroup = newComp.find(NavGroup).first();

      expect(navGroup.props().open).to.equal(firstTab.form_group_id);
    });

    it("opens the selectedForm and group", () => {
      const { component: newComp } = setupMountedComponent(
        Nav,
        { ...notSelectedProps, selectedForm: APPROVALS },
        initialState
      );

      const setAction = newComp
        .props()
        .store.getActions()
        .find(action => action.type === Actions.SET_SELECTED_FORM);

      expect(setAction).to.not.exist;

      const navGroup = newComp.find(NavGroup).first();

      expect(navGroup.props().open).to.equal(RECORD_INFORMATION_GROUP);
    });
  });

  describe("when the selected record is not the current record", () => {
    const firstTab = { unique_id: "basic_identity", form_group_id: "basic_identity" };
    const notSelectedProps = {
      ...props,
      firstTab,
      selectedRecord: "",
      isNew: false,
      selectedForm: ""
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(Nav, notSelectedProps, initialState));
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

    it("opens the form_group_id of the firstTab", () => {
      const navGroup = component.find(NavGroup).first();

      expect(navGroup.props().open).to.equal(firstTab.form_group_id);
    });
  });

  describe("when the selected form is a Record Information form", () => {
    const firstTab = { unique_id: "basic_identity", form_group_id: "basic_identity" };
    const notSelectedProps = {
      ...props,
      firstTab,
      isNew: false,
      selectedForm: REFERRAL
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(Nav, notSelectedProps, initialState));
    });

    it("should not select a different form", () => {
      const setAction = component
        .props()
        .store.getActions()
        .find(action => action.type === Actions.SET_SELECTED_FORM);

      expect(setAction).to.not.exist;
    });

    it("opens the record_information group if it belongs to that group", () => {
      const navGroup = component.find(NavGroup).first();

      expect(navGroup.props().open).to.equal(RECORD_INFORMATION_GROUP);
    });
  });

  describe("when the selected form is not found in the record forms", () => {
    const firstTab = { unique_id: "basic_identity", form_group_id: "basic_identity" };
    const notSelectedProps = {
      ...props,
      firstTab,
      isNew: false,
      selectedForm: "unknown_form"
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(Nav, notSelectedProps, initialState));
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

    it("opens the form_group_id form the firstTab", () => {
      const navGroup = component.find(NavGroup).first();

      expect(navGroup.props().open).to.equal(firstTab.form_group_id);
    });
  });

  describe("when clicking a formGroup", () => {
    const formNavWithGroups = OrderedMap({
      1: OrderedMap({
        1: {
          formId: "basic_identity",
          group: "identification_registration",
          groupOrder: 30,
          is_first_tab: true,
          name: "Basic Identity",
          order: 10,
          permission_actions: []
        },
        2: {
          formId: "incident_details_container",
          group: "identification_registration",
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
          groupOrder: 50,
          is_first_tab: false,
          name: "Family Details",
          order: 10,
          permission_actions: []
        },
        4: {
          formId: "partner_details",
          group: "family_partner_details",
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
      const { component: navComponent } = setupMountedComponent(Nav, navGroupProps, initialState);
      const registrationGroup = navComponent.find(".MuiListItem-gutters").at(3);

      expect(registrationGroup.text()).to.be.equal("Identification / Registration");

      registrationGroup.simulate("click");
      expect(navComponent.find(".Mui-selected").at(0).text()).to.be.equal("Basic Identity");
    });
  });

  describe("when a user clicks the back button", () => {
    const firstTab = { unique_id: "basic_identity", form_group_id: "basic_identity" };
    const notSelectedProps = {
      ...props,
      firstTab,
      isNew: false,
      selectedForm: APPROVALS,
      history: { action: "POP" }
    };

    it("should open the record_information group if selectedForm belongs to that group ", () => {
      const { component: navComp } = setupMountedComponent(Nav, notSelectedProps, initialState);

      const navGroup = navComp.find(NavGroup).first();

      expect(navGroup.props().open).to.equal(RECORD_INFORMATION_GROUP);
    });

    it("opens the record_information group and sets incidents froms if there is a incidentFromCase", () => {
      const stateWithIncidentFromCase = initialState.setIn(
        ["records", "cases", "incidentFromCase", "data"],
        fromJS({ incident_case_id: "case-id-1" })
      );
      const { component: navComp } = setupMountedComponent(
        Nav,
        { ...notSelectedProps, selectedForm: "" },
        stateWithIncidentFromCase
      );

      const navGroup = navComp.find(NavGroup).first();

      expect(navGroup.props().open).to.equal(RECORD_INFORMATION_GROUP);

      const expectedAction = {
        type: Actions.SET_SELECTED_FORM,
        payload: INCIDENT_FROM_CASE
      };

      const setAction = navComp
        .props()
        .store.getActions()
        .filter(action => action.type === Actions.SET_SELECTED_FORM)
        .pop();

      expect(setAction).to.deep.equal(expectedAction);
    });

    it("opens the firstTab group and form when incident_from_case form is not found", () => {
      const stateWithIncidentFromCase = initialState.setIn(
        ["records", "cases", "incidentFromCase"],
        fromJS({ incident_case_id: "case-id-1" })
      );

      const { component: navComp } = setupMountedComponent(
        Nav,
        { ...notSelectedProps, recordType: "incidents", selectedForm: "basic_identity" },
        stateWithIncidentFromCase
      );

      const expectedAction = {
        type: Actions.SET_SELECTED_FORM,
        payload: firstTab.unique_id
      };

      const setAction = navComp
        .props()
        .store.getActions()
        .filter(action => action.type === Actions.SET_SELECTED_FORM)
        .pop();

      const navGroup = navComp.find(NavGroup).first();

      expect(setAction).to.deep.equal(expectedAction);
      expect(navGroup.props().open).to.equal(firstTab.form_group_id);
    });

    it("opens the form_group_id and sets the selectedForm from the firstTab if the selected form is not found", () => {
      const { component: navComp } = setupMountedComponent(
        Nav,
        { ...notSelectedProps, selectedForm: "unknown_form" },
        initialState
      );

      const navGroup = navComp.find(NavGroup).first();

      expect(navGroup.props().open).to.equal(firstTab.form_group_id);

      const expectedAction = {
        type: Actions.SET_SELECTED_FORM,
        payload: firstTab.unique_id
      };

      const setAction = navComp
        .props()
        .store.getActions()
        .filter(action => action.type === Actions.SET_SELECTED_FORM)
        .pop();

      expect(setAction).to.deep.equal(expectedAction);
    });
  });

  describe("when the firstTab props is empty", () => {
    const propsNoFirstTab = {
      ...props,
      isNew: false,
      selectedForm: "",
      firstTab: null,
      hasForms: false
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(Nav, propsNoFirstTab, initialState));
    });

    it("should open record information", () => {
      const navGroup = component.find(NavGroup).first();

      expect(navGroup.props().open).to.equal("record_information");
    });
  });
});
