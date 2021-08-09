import { OrderedMap, fromJS } from "immutable";
import { Menu, MenuItem } from "@material-ui/core";

import { setupMountedComponent } from "../../test";
import { ACTIONS } from "../../libs/permissions";
import { FieldRecord, FormSectionRecord } from "../record-form/records";
import ActionButton from "../action-button";

import Notes from "./notes";
import RecordActions from "./container";
import ToggleEnable from "./toggle-enable";
import ToggleOpen from "./toggle-open";
import RequestApproval from "./request-approval";
import Transitions from "./transitions";
import Exports from "./exports";
import AddIncident from "./add-incident";
import AddService from "./add-service";
import {
  REQUEST_APPROVAL_DIALOG,
  ENABLE_DISABLE_DIALOG,
  NOTES_DIALOG,
  OPEN_CLOSE_DIALOG,
  TRANSFER_DIALOG,
  EXPORT_DIALOG
} from "./constants";

describe("<RecordActions />", () => {
  const forms = {
    formSections: OrderedMap({
      1: FormSectionRecord({
        id: 1,
        unique_id: "incident_details_subform_section",
        name: { en: "Nested Incident Details Subform" },
        visible: false,
        is_first_tab: false,
        order: 20,
        order_form_group: 110,
        parent_form: "case",
        editable: true,
        module_ids: [],
        form_group_id: "",
        form_group_name: { en: "Nested Incident Details Subform" },
        fields: [2],
        is_nested: true,
        subform_prevent_item_removal: false,
        collapsed_field_names: ["cp_incident_date", "cp_incident_violence_type"]
      }),
      2: FormSectionRecord({
        id: 2,
        unique_id: "incident_details_container",
        name: { en: "Incident Details" },
        visible: true,
        is_first_tab: false,
        order: 0,
        order_form_group: 30,
        parent_form: "case",
        editable: true,
        module_ids: ["primeromodule-cp"],
        form_group_id: "identification_registration",
        form_group_name: { en: "Identification / Registration" },
        fields: [1],
        is_nested: false,
        subform_prevent_item_removal: false,
        collapsed_field_names: []
      }),
      3: FormSectionRecord({
        id: 3,
        unique_id: "services",
        fields: [3],
        visible: true,
        parent_form: "case",
        module_ids: ["primeromodule-cp"]
      }),
      4: FormSectionRecord({
        id: 3,
        unique_id: "services_section_subform",
        fields: [4],
        visible: true
      })
    }),
    fields: OrderedMap({
      1: FieldRecord({
        name: "incident_details",
        type: "subform",
        editable: true,
        disabled: false,
        visible: true,
        subform_section_id: 1,
        help_text: { en: "" },
        display_name: { en: "" },
        multi_select: false,
        option_strings_source: null,
        option_strings_text: {},
        guiding_questions: "",
        required: false,
        date_validation: "default_date_validation",
        hide_on_view_page: false,
        date_include_time: false,
        selected_value: "",
        subform_sort_by: "summary_date",
        show_on_minify_form: false
      }),
      2: FieldRecord({
        name: "cp_incident_location_type_other",
        type: "text_field",
        editable: true,
        disabled: false,
        visible: true,
        subform_section_id: null,
        help_text: {},
        multi_select: false,
        option_strings_source: null,
        option_strings_text: {},
        guiding_questions: "",
        required: false,
        date_validation: "default_date_validation",
        hide_on_view_page: false,
        date_include_time: false,
        selected_value: "",
        subform_sort_by: "",
        show_on_minify_form: false
      }),
      3: FieldRecord({
        name: "services_section",
        type: "subform",
        subform_section_id: 4,
        visible: true,
        editable: true,
        disabled: false
      }),
      4: FieldRecord({
        name: "text_field_2",
        type: "text_field",
        visible: true
      })
    })
  };
  let component;

  const defaultState = fromJS({
    records: {
      cases: {
        data: [
          {
            sex: "female",
            owned_by_agency_id: 1,
            record_in_scope: true,
            created_at: "2020-01-29T21:57:00.274Z",
            name: "User 1",
            alert_count: 0,
            case_id_display: "b575f47",
            owned_by: "primero_cp_ar",
            status: "open",
            registration_date: "2020-01-29",
            id: "b342c488-578e-4f5c-85bc-35ece34cccdf",
            flag_count: 0,
            short_id: "b575f47",
            age: 15,
            workflow: "new"
          }
        ],
        filters: {
          status: ["true"]
        }
      }
    },
    user: {
      permissions: {
        cases: [ACTIONS.MANAGE, ACTIONS.EXPORT_JSON]
      }
    },
    forms
  });

  const defaultStateWithDialog = dialog =>
    defaultState.merge(
      fromJS({
        ui: {
          dialogs: {
            dialog,
            open: true
          }
        }
      })
    );

  const props = {
    recordType: "cases",
    mode: { isShow: true },
    record: fromJS({ status: "open" })
  };

  describe("Component ActionButton", () => {
    it("should render and ActionButton component", () => {
      ({ component } = setupMountedComponent(RecordActions, props, defaultState));
      expect(component.find(ActionButton)).to.have.lengthOf(1);
    });

    it("should not render and ActionButton component if there are not actions", () => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        fromJS({
          user: {
            permissions: {
              cases: ["gbv_referral_form", "record_owner"]
            }
          },
          forms
        })
      ));
      expect(component.find(ActionButton)).to.be.empty;
    });
  });

  describe("Component ToggleOpen", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(RecordActions, props, defaultStateWithDialog(OPEN_CLOSE_DIALOG)));
    });

    it("renders ToggleOpen", () => {
      expect(component.find(ToggleOpen)).to.have.length(1);
    });
  });

  describe("Component ToggleEnable", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(RecordActions, props, defaultStateWithDialog(ENABLE_DISABLE_DIALOG)));
    });

    it("renders ToggleEnable", () => {
      expect(component.find(ToggleEnable)).to.have.length(1);
    });
  });

  describe("Component RequestApproval", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(RecordActions, props, defaultStateWithDialog(REQUEST_APPROVAL_DIALOG)));
    });

    it("renders RequestApproval", () => {
      expect(component.find(RequestApproval)).to.have.length(1);
    });
  });

  describe("Component Transitions", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(RecordActions, props, defaultStateWithDialog(TRANSFER_DIALOG)));
    });
    it("renders Transitions", () => {
      expect(component.find(Transitions)).to.have.length(1);
    });

    it("renders valid props for Transitions components", () => {
      const transitionsProps = { ...component.find(Transitions).props() };

      expect(component.find(Transitions)).to.have.lengthOf(1);
      [
        "open",
        "record",
        "recordType",
        "userPermissions",
        "pending",
        "setPending",
        "currentPage",
        "selectedRecords",
        "close",
        "currentDialog",
        "selectedRowsIndex",
        "mode"
      ].forEach(property => {
        expect(transitionsProps).to.have.property(property);
        delete transitionsProps[property];
      });
      expect(transitionsProps).to.be.empty;
    });
  });

  describe("Component Notes", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(RecordActions, props, defaultStateWithDialog(NOTES_DIALOG)));
    });

    it("renders Notes", () => {
      expect(component.find(Notes)).to.have.length(1);
    });
  });

  describe("Component Menu", () => {
    describe("when user has access to all menus", () => {
      beforeEach(() => {
        ({ component } = setupMountedComponent(
          RecordActions,
          props,
          fromJS({
            records: {
              cases: {
                filters: {
                  id_search: true
                }
              }
            },
            user: {
              permissions: {
                cases: [ACTIONS.MANAGE]
              }
            },
            forms
          })
        ));
      });
      it("renders Menu", () => {
        expect(component.find(Menu)).to.have.length(1);
      });

      it("renders MenuItem", () => {
        expect(component.find(MenuItem)).to.have.length(10);
      });

      it("renders MenuItem with Refer Cases option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("buttons.referral forms.record_types.case")
        ).to.be.equal(true);
      });

      it("renders MenuItem with Add Incident option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("actions.incident_details_from_case")
        ).to.be.false;
      });

      it("renders MenuItem with Add Services Provision option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("actions.services_section_from_case")
        ).to.be.false;
      });

      it("renders MenuItem with Export option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("cases.export")
        ).to.be.true;
      });

      it("renders MenuItem with Create Incident option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("actions.incident_from_case")
        ).to.be.true;
      });
    });

    describe("when user has not access to all menus", () => {
      beforeEach(() => {
        ({ component } = setupMountedComponent(
          RecordActions,
          props,
          fromJS({
            user: {
              permissions: {
                cases: [ACTIONS.READ]
              }
            },
            forms
          })
        ));
      });

      it("renders Menu", () => {
        expect(component.find(Menu)).to.have.length(1);
      });

      it("renders MenuItem", () => {
        expect(component.find(MenuItem)).to.be.empty;
      });

      it("renders MenuItem without Refer Cases option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("buttons.referral forms.record_types.case")
        ).to.be.false;
      });

      it("renders MenuItem without Export custom option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("exports.custom_exports.label")
        ).to.be.false;
      });

      it("renders MenuItem without Export option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("cases.export")
        ).to.be.false;
      });
    });

    describe("when user has read access to cases and assign_within_agency", () => {
      beforeEach(() => {
        ({ component } = setupMountedComponent(
          RecordActions,
          props,
          fromJS({
            user: {
              permissions: {
                cases: [ACTIONS.READ, ACTIONS.ASSIGN_WITHIN_AGENCY]
              }
            },
            forms
          })
        ));
      });

      it("renders Menu", () => {
        expect(component.find(Menu)).to.have.length(1);
      });

      it("renders MenuItem", () => {
        expect(component.find(MenuItem)).to.be.empty;
      });

      it("renders MenuItem with the Assign Case option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("buttons.reassign forms.record_types.case")
        ).to.be.true;
      });
    });
  });

  describe("Component Exports", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(RecordActions, props, defaultStateWithDialog(EXPORT_DIALOG)));
    });

    it("renders Exports", () => {
      expect(component.find(Exports)).to.have.lengthOf(1);
    });

    it("renders valid props for Exports components", () => {
      const exportProps = { ...component.find(Exports).props() };

      expect(component.find(Exports)).to.have.lengthOf(1);
      [
        "close",
        "currentPage",
        "open",
        "pending",
        "record",
        "recordType",
        "selectedRecords",
        "setPending",
        "userPermissions",
        "currentDialog",
        "selectedRowsIndex",
        "mode"
      ].forEach(property => {
        expect(exportProps).to.have.property(property);
        delete exportProps[property];
      });
      expect(exportProps).to.be.empty;
    });

    describe("when user can only export pdf", () => {
      const state = fromJS({
        user: {
          permissions: {
            cases: [ACTIONS.READ, ACTIONS.EXPORT_PDF]
          }
        },
        forms
      });

      it("should not render <Exports /> component", () => {
        const { component: componentWithOnlyPdf } = setupMountedComponent(RecordActions, props, state);

        expect(componentWithOnlyPdf.find(Exports)).to.be.empty;
      });
    });
  });

  describe("when record is selected", () => {
    const propsRecordSelected = {
      ...props,
      showListActions: true,
      currentPage: 0,
      selectedRecords: { 0: [0] }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(RecordActions, propsRecordSelected, defaultState));
    });

    it.skip("renders add refer menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(0);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("buttons.referral forms.record_types.case");
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add reassign menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(0);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("buttons.reassign forms.record_types.case");
      expect(incidentItemProps.disabled).to.be.false;
    });

    it.skip("renders add transfer menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(2);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("buttons.transfer forms.record_types.case");
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add incident menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(1);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("actions.incident_details_from_case");
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add service menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(2);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("actions.services_section_from_case");
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add export menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(3);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("cases.export");
      expect(incidentItemProps.disabled).to.be.false;
    });
  });

  describe("when record is selected from a search, id_search: true", () => {
    const defaultStateFromSearch = fromJS({
      records: {
        cases: {
          data: [
            {
              sex: "female",
              owned_by_agency_id: 1,
              record_in_scope: true,
              created_at: "2020-01-29T21:57:00.274Z",
              name: "User 1",
              alert_count: 0,
              case_id_display: "b575f47",
              owned_by: "primero_cp_ar",
              status: "open",
              registration_date: "2020-01-29",
              id: "b342c488-578e-4f5c-85bc-35ece34cccdf",
              flag_count: 0,
              short_id: "b575f47",
              age: 15,
              workflow: "new"
            }
          ],
          filters: {
            status: ["true"],
            id_search: true
          }
        }
      },
      user: {
        permissions: {
          cases: [ACTIONS.MANAGE]
        }
      },
      forms
    });
    const propsRecordSelected = {
      ...props,
      showListActions: true,
      currentPage: 0,
      selectedRecords: { 0: [0] }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(RecordActions, propsRecordSelected, defaultStateFromSearch));
    });

    it.skip("renders add refer menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(0);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("buttons.referral forms.record_types.case");
      expect(incidentItemProps.disabled).to.be.false;
    });

    it.skip("renders add reassign menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(0);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("buttons.reassign forms.record_types.case");
      expect(incidentItemProps.disabled).to.be.false;
    });

    it.skip("renders add transfer menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(2);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("buttons.transfer forms.record_types.case");
      expect(incidentItemProps.disabled).to.be.false;
    });

    it.skip("renders add incident menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(3);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("actions.incident_details_from_case");
      expect(incidentItemProps.disabled).to.be.false;
    });

    it.skip("renders add service menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(5);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("actions.services_section_from_case");
      expect(incidentItemProps.disabled).to.be.false;
    });

    it.skip("renders add export menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(3);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("cases.export");
      expect(incidentItemProps.disabled).to.be.false;
    });
  });

  describe("when no record is selected", () => {
    const propsRecordSelected = {
      ...props,
      showListActions: true,
      currentPage: 0,
      selectedRecords: {}
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(RecordActions, propsRecordSelected, defaultState));
    });

    it.skip("renders add refer menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(0);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("buttons.referral forms.record_types.case");
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add reassign menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(0);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("buttons.reassign forms.record_types.case");
      expect(incidentItemProps.disabled).to.be.true;
    });

    it.skip("renders add transfer menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(2);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("buttons.transfer forms.record_types.case");
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add incident menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(1);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("actions.incident_details_from_case");
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add service menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(2);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("actions.services_section_from_case");
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add export menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(3);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("cases.export");
      expect(incidentItemProps.disabled).to.be.true;
    });
  });

  describe("when many records are selected", () => {
    const propsRecordSelected = {
      ...props,
      showListActions: true,
      currentPage: 0,
      selectedRecords: { 0: [0, 1] }
    };

    const defaultStateRecordSelected = fromJS({
      records: {
        cases: {
          data: [
            {
              sex: "female",
              owned_by_agency_id: 1,
              record_in_scope: true,
              created_at: "2020-01-29T21:57:00.274Z",
              name: "User 1",
              alert_count: 0,
              case_id_display: "b575f47",
              owned_by: "primero_cp_ar",
              status: "open",
              registration_date: "2020-01-29",
              id: "b342c488-578e-4f5c-85bc-35ece34cccdf",
              flag_count: 0,
              short_id: "b575f47",
              age: 15,
              workflow: "new"
            },
            {
              sex: "male",
              owned_by_agency_id: 1,
              record_in_scope: true,
              created_at: "2020-02-29T21:57:00.274Z",
              name: "User 1",
              alert_count: 0,
              case_id_display: "c23a5fca",
              owned_by: "primero_cp",
              status: "open",
              registration_date: "2020-05-02",
              id: "b342c488-578e-4f5c-85bc-35ecec23a5fca",
              flag_count: 0,
              short_id: "c23a5fca",
              age: 5,
              workflow: "new"
            }
          ],
          metadata: {
            total: 3,
            per: 20,
            page: 1
          },
          filters: {
            status: ["true"]
          }
        }
      },
      user: {
        permissions: {
          cases: [ACTIONS.MANAGE]
        }
      },
      forms
    });

    beforeEach(() => {
      ({ component } = setupMountedComponent(RecordActions, propsRecordSelected, defaultStateRecordSelected));
    });

    it.skip("renders add refer menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(0);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("buttons.referral forms.record_types.case");
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add reassign menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(0);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("buttons.reassign forms.record_types.case");
      expect(incidentItemProps.disabled).to.be.false;
    });

    it.skip("renders add transfer menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(2);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("buttons.transfer forms.record_types.case");
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add incident menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(1);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("actions.incident_details_from_case");
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add service menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(2);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("actions.services_section_from_case");
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add export menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(3);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("cases.export");
      expect(incidentItemProps.disabled).to.be.false;
    });
  });

  describe("when all the records are selected", () => {
    const propsRecordSelected = {
      ...props,
      showListActions: true,
      currentPage: 0,
      selectedRecords: { 0: [0, 1, 2] }
    };
    const defaultStateAllRecordSelected = fromJS({
      records: {
        cases: {
          data: [
            {
              sex: "female",
              owned_by_agency_id: 1,
              record_in_scope: true,
              created_at: "2020-01-29T21:57:00.274Z",
              name: "User 1",
              alert_count: 0,
              case_id_display: "b575f47",
              owned_by: "primero_cp_ar",
              status: "open",
              registration_date: "2020-01-29",
              id: "b342c488-578e-4f5c-85bc-35ece34cccdf",
              flag_count: 0,
              short_id: "b575f47",
              age: 15,
              workflow: "new"
            },
            {
              sex: "male",
              owned_by_agency_id: 1,
              record_in_scope: true,
              created_at: "2020-02-29T21:57:00.274Z",
              name: "User 1",
              alert_count: 0,
              case_id_display: "c23a5fca",
              owned_by: "primero_cp",
              status: "open",
              registration_date: "2020-05-02",
              id: "b342c488-578e-4f5c-85bc-35ecec23a5fca",
              flag_count: 0,
              short_id: "c23a5fca",
              age: 5,
              workflow: "new"
            },
            {
              sex: "female",
              owned_by_agency_id: 1,
              record_in_scope: true,
              created_at: "2020-03-18T21:57:00.274Z",
              name: "User 1",
              alert_count: 0,
              case_id_display: "9C68741",
              owned_by: "primero_cp",
              status: "open",
              registration_date: "2020-04-18",
              id: "d861c56c-8dc9-41c9-974b-2b24299b70a2",
              flag_count: 0,
              short_id: "9C68741",
              age: 7,
              workflow: "new"
            }
          ],
          metadata: {
            total: 3,
            per: 20,
            page: 1
          },
          filters: {
            status: ["true"]
          }
        }
      },
      user: {
        permissions: {
          cases: [ACTIONS.MANAGE]
        }
      },
      forms
    });

    beforeEach(() => {
      ({ component } = setupMountedComponent(RecordActions, propsRecordSelected, defaultStateAllRecordSelected));
    });

    it.skip("renders add refer menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(0);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("buttons.referral forms.record_types.case");
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add reassign menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(0);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("buttons.reassign forms.record_types.case");
      expect(incidentItemProps.disabled).to.be.true;
    });

    it.skip("renders add transfer menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(2);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("buttons.transfer forms.record_types.case");
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add incident menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(1);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("actions.incident_details_from_case");
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add service menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(2);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("actions.services_section_from_case");
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add export menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(3);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("cases.export");
      expect(incidentItemProps.disabled).to.be.false;
    });
  });

  describe("when incident subform is not presented", () => {
    const newForms = {
      formSections: OrderedMap({
        1: FormSectionRecord({
          id: 1,
          unique_id: "incident_details_container",
          name: { en: "Incident Details" },
          visible: true,
          parent_form: "case",
          editable: true,
          module_ids: ["primeromodule-cp"],
          fields: [1]
        }),
        2: FormSectionRecord({
          id: 2,
          unique_id: "services",
          fields: [2],
          visible: true,
          parent_form: "case",
          module_ids: ["primeromodule-cp"]
        })
      }),
      fields: OrderedMap({
        1: FieldRecord({
          name: "incident_details",
          type: "subform",
          subform_section_id: null,
          editable: true,
          disabled: false,
          visible: true
        }),
        2: FieldRecord({
          name: "services_section",
          type: "subform",
          subform_section_id: null,
          visible: true,
          editable: true,
          disabled: false
        })
      })
    };
    const state = fromJS({
      records: {
        cases: {
          data: [
            {
              sex: "female",
              owned_by_agency_id: 1,
              record_in_scope: true,
              created_at: "2020-01-29T21:57:00.274Z",
              name: "User 1",
              case_id_display: "b575f47",
              id: "b342c488-578e-4f5c-85bc-35ece34cccdf"
            }
          ],
          filters: {
            status: ["true"]
          }
        }
      },
      user: {
        permissions: {
          cases: [ACTIONS.MANAGE]
        }
      },
      forms: newForms
    });
    const { component: emptyComponent } = setupMountedComponent(RecordActions, props, state);

    it("should not render AddIncident component", () => {
      expect(emptyComponent.find(AddIncident)).to.be.empty;
    });

    it("should not render AddService component", () => {
      expect(emptyComponent.find(AddService)).to.be.empty;
    });
  });
});
