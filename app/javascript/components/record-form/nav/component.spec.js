// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS, Map, OrderedMap } from "immutable";

import { APPROVALS, REFERRAL } from "../../../config";
import { fireEvent, mountedComponent, screen, setScreenSizeToMobile, waitFor } from "../../../test-utils";
import { FormSectionRecord, FieldRecord } from "../records";
import Actions from "../actions";

import Nav from "./component";

describe("<Nav />", () => {
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

  beforeAll(() => {
    setScreenSizeToMobile(false);
  });

  it("renders a CloseIcon component />", () => {
    mountedComponent(<Nav {...props} />, initialState);
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
  });

  it("renders a Nav component />", () => {
    mountedComponent(<Nav {...props} />, initialState);
    expect(screen.getByTestId("nav-list")).toBeInTheDocument();
  });

  describe("when is a new record", () => {
    const firstTab = { unique_id: "first_form", form_group_id: "first_group" };
    const notSelectedProps = {
      ...props,
      firstTab,
      selectedForm: "",
      isNew: true
    };

    it("opens the selectedForm and group", () => {
      mountedComponent(<Nav {...{ ...notSelectedProps, selectedForm: APPROVALS }} />, initialState);
      expect(screen.getByText("forms.record_types.record_information", { expanded: true })).toBeInTheDocument();
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

    it("opens the form_group_id of the firstTab", () => {
      mountedComponent(<Nav {...notSelectedProps} />, initialState);
      expect(screen.getByText("Basic Identity", { expanded: true })).toBeInTheDocument();
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

    it("should not select a different form", () => {
      const { store } = mountedComponent(<Nav {...notSelectedProps} />, initialState);

      expect(store.getActions().find(action => action.type === Actions.SET_SELECTED_FORM)).toBeUndefined();
    });

    it("opens the record_information group if it belongs to that group", () => {
      mountedComponent(<Nav {...notSelectedProps} />, initialState);
      expect(screen.getByText("forms.record_types.record_information", { expanded: true })).toBeInTheDocument();
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

    it("opens the form_group_id form the firstTab", () => {
      mountedComponent(<Nav {...notSelectedProps} />, initialState);
      expect(screen.getByText("Basic Identity", { expanded: true })).toBeInTheDocument();
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

    it("should select first form of the form group", async () => {
      mountedComponent(<Nav {...navGroupProps} />, initialState);
      fireEvent.click(screen.getByText("Identification / Registration"));

      await waitFor(() =>
        expect(screen.getByText("Basic Identity").closest(".MuiButtonBase-root")).toHaveClass("navSelected")
      );
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
      mountedComponent(<Nav {...notSelectedProps} />, initialState);
      expect(screen.getByText("forms.record_types.record_information", { expanded: true })).toBeInTheDocument();
    });

    it("opens the record_information group and sets incidents froms if there is a incidentFromCase", () => {
      const stateWithIncidentFromCase = initialState.setIn(
        ["records", "cases", "incidentFromCase", "data"],
        fromJS({ incident_case_id: "case-id-1" })
      );

      const tProps = { ...notSelectedProps, selectedForm: "" };
      const { store } = mountedComponent(<Nav {...tProps} />, stateWithIncidentFromCase);

      expect(
        store
          .getActions()
          .filter(action => action.type === Actions.SET_SELECTED_FORM)
          .pop()
      ).toStrictEqual({ type: "forms/SET_SELECTED_FORM", payload: "incident_from_case" });
      expect(screen.getByText("forms.record_types.record_information", { expanded: true })).toBeInTheDocument();
    });

    it("opens the firstTab group and form when incident_from_case form is not found", () => {
      const stateWithIncidentFromCase = initialState.setIn(
        ["records", "cases", "incidentFromCase"],
        fromJS({ incident_case_id: "case-id-1" })
      );

      const tProps = { ...notSelectedProps, recordType: "incidents", selectedForm: "basic_identity" };
      const { store } = mountedComponent(<Nav {...tProps} />, stateWithIncidentFromCase);

      expect(store.getActions()).toStrictEqual([{ type: "forms/SET_SELECTED_FORM", payload: "basic_identity" }]);
      expect(screen.getByText("Basic Identity", { expanded: true })).toBeInTheDocument();
    });

    it("opens the form_group_id and sets the selectedForm from the firstTab if the selected form is not found", () => {
      const tProps = { ...notSelectedProps, selectedForm: "unknown_form" };
      const { store } = mountedComponent(<Nav {...tProps} />, initialState);

      expect(store.getActions()).toStrictEqual([{ type: "forms/SET_SELECTED_FORM", payload: "basic_identity" }]);
      expect(screen.getByText("Basic Identity", { expanded: true })).toBeInTheDocument();
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

    it("should open record information", () => {
      mountedComponent(<Nav {...propsNoFirstTab} />, initialState);
      expect(screen.getByText("forms.record_types.record_information", { expanded: true })).toBeInTheDocument();
    });
  });
});
