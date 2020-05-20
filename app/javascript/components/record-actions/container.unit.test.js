import { OrderedMap, fromJS } from "immutable";
import { Menu, MenuItem } from "@material-ui/core";

import { setupMountedComponent } from "../../test";
import { ACTIONS } from "../../libs/permissions";
import { FieldRecord, FormSectionRecord } from "../record-form/records";

import Notes from "./notes";
import RecordActions from "./container";
import ToggleEnable from "./toggle-enable";
import ToggleOpen from "./toggle-open";
import RequestApproval from "./request-approval";
import Transitions from "./transitions";
import Exports from "./exports";

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
        cases: [ACTIONS.MANAGE]
      }
    },
    forms
  });
  const props = {
    recordType: "cases",
    mode: { isShow: true },
    record: fromJS({ status: "open" })
  };

  describe("Component ToggleOpen", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
    });

    it("renders ToggleOpen", () => {
      expect(component.find(ToggleOpen)).to.have.length(1);
    });
  });

  describe("Component ToggleEnable", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
    });

    it("renders ToggleEnable", () => {
      expect(component.find(ToggleEnable)).to.have.length(1);
    });
  });

  describe("Component RequestApproval", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
    });

    it("renders RequestApproval", () => {
      expect(component.find(RequestApproval)).to.have.length(2);
    });
  });

  describe("Component Transitions", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
    });
    it("renders Transitions", () => {
      expect(component.find(Transitions)).to.have.length(1);
    });
  });

  describe("Component Notes", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
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
        expect(component.find(MenuItem)).to.have.length(11);
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
        ).to.be.equal(true);
      });

      it("renders MenuItem with Add Services Provision option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("actions.services_section_from_case")
        ).to.be.equal(true);
      });

      it("renders MenuItem with Export option", () => {
        expect(
          component
            .find("li")
            .map(l => l.text())
            .includes("cases.export")
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
            }
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
  });

  describe("Component Exports", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordActions,
        props,
        defaultState
      ));
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
        "openExportsDialog",
        "pending",
        "record",
        "recordType",
        "selectedRecords",
        "setPending",
        "userPermissions"
      ].forEach(property => {
        expect(exportProps).to.have.property(property);
        delete exportProps[property];
      });
      expect(exportProps).to.be.empty;
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
      ({ component } = setupMountedComponent(
        RecordActions,
        propsRecordSelected,
        defaultState
      ));
    });

    it("renders add refer menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(0);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "buttons.referral forms.record_types.case"
      );
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add reassign menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(1);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "buttons.reassign forms.record_types.case"
      );
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add transfer menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(2);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "buttons.transfer forms.record_types.case"
      );
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add incident menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(3);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "actions.incident_details_from_case"
      );
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add service menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(4);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "actions.services_section_from_case"
      );
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add export menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(5);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("cases.export");
      expect(incidentItemProps.disabled).to.be.false;
    });
  });

  describe("when record is selected from a search,  id_search: true", () => {
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
      ({ component } = setupMountedComponent(
        RecordActions,
        propsRecordSelected,
        defaultStateFromSearch
      ));
    });

    it("renders add refer menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(0);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "buttons.referral forms.record_types.case"
      );
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add reassign menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(1);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "buttons.reassign forms.record_types.case"
      );
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add transfer menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(2);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "buttons.transfer forms.record_types.case"
      );
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add incident menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(3);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "actions.incident_details_from_case"
      );
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add service menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(4);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "actions.services_section_from_case"
      );
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add export menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(5);
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
      ({ component } = setupMountedComponent(
        RecordActions,
        propsRecordSelected,
        defaultState
      ));
    });

    it("renders add refer menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(0);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "buttons.referral forms.record_types.case"
      );
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add reassign menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(1);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "buttons.reassign forms.record_types.case"
      );
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add transfer menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(2);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "buttons.transfer forms.record_types.case"
      );
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add incident menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(3);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "actions.incident_details_from_case"
      );
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add service menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(4);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "actions.services_section_from_case"
      );
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add export menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(5);
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
      ({ component } = setupMountedComponent(
        RecordActions,
        propsRecordSelected,
        defaultStateRecordSelected
      ));
    });

    it("renders add refer menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(0);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "buttons.referral forms.record_types.case"
      );
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add reassign menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(1);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "buttons.reassign forms.record_types.case"
      );
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add transfer menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(2);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "buttons.transfer forms.record_types.case"
      );
      expect(incidentItemProps.disabled).to.be.false;
    });

    it("renders add incident menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(3);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "actions.incident_details_from_case"
      );
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add service menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(4);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "actions.services_section_from_case"
      );
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add export menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(5);
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
      ({ component } = setupMountedComponent(
        RecordActions,
        propsRecordSelected,
        defaultStateAllRecordSelected
      ));
    });

    it("renders add refer menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(0);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "buttons.referral forms.record_types.case"
      );
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add reassign menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(1);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "buttons.reassign forms.record_types.case"
      );
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add transfer menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(2);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "buttons.transfer forms.record_types.case"
      );
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add incident menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(3);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "actions.incident_details_from_case"
      );
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add service menu disabled", () => {
      const incidentItem = component.find(MenuItem).at(4);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal(
        "actions.services_section_from_case"
      );
      expect(incidentItemProps.disabled).to.be.true;
    });

    it("renders add export menu enabled", () => {
      const incidentItem = component.find(MenuItem).at(5);
      const incidentItemProps = incidentItem.props();

      expect(incidentItem.text()).to.be.equal("cases.export");
      expect(incidentItemProps.disabled).to.be.false;
    });
  });
});
