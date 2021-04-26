import { fromJS, OrderedMap } from "immutable";

import { setupMountedComponent } from "../../../test";
import { RECORD_TYPES, RECORD_PATH, MODULES } from "../../../config";
import { ACTIONS } from "../../../libs/permissions";
import { PrimeroModuleRecord } from "../../application/records";
import RecordActions from "../../record-actions";
import AddRecordMenu from "../add-record-menu";
import { FieldRecord, FormSectionRecord } from "../../record-form/records";

import RecordListToolbar from "./component";

describe("<RecordListToolbar />", () => {
  let component;
  const forms = {
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
  const props = {
    title: "This is a record list toolbar",
    recordType: RECORD_PATH.cases,
    handleDrawer: () => {},
    mobileDisplay: false,
    currentPage: 0,
    selectedRecords: { 0: [0, 1] },
    css: { toolbar: "" }
  };
  const initialState = fromJS({
    application: {
      online: true,
      modules: [
        PrimeroModuleRecord({
          unique_id: MODULES.CP,
          name: "CP",
          associated_record_types: [RECORD_TYPES.cases],
          options: {
            user_group_filter: true
          },
          workflows: {}
        })
      ]
    },
    user: {
      modules: [MODULES.CP],
      permissions: {
        cases: [ACTIONS.CREATE]
      }
    },
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
            created_at: "2020-01-29T21:57:00.274Z",
            name: "User 1",
            alert_count: 0,
            case_id_display: "b575f57",
            owned_by: "primero_cp",
            status: "open",
            registration_date: "2020-01-29",
            id: "b342c488-578e-4f5c-85bc-35eceb575f57",
            flag_count: 0,
            short_id: "b575f57",
            age: 15,
            workflow: "new"
          }
        ],
        filters: {
          status: ["true"]
        }
      }
    },
    forms
  });
  // eslint-disable-next-line react/display-name
  const RecordListToolbarForm = () => {
    return <RecordListToolbar {...props} />;
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(RecordListToolbarForm, props, initialState));
  });

  it("should render RecordListToolbar with AddRecordMenu", () => {
    expect(component.find(RecordListToolbar)).to.have.lengthOf(1);
    expect(component.find(AddRecordMenu)).to.have.lengthOf(1);
  });

  it("should render RecordListToolbar with RecordActions", () => {
    expect(component.find(RecordListToolbar)).to.have.lengthOf(1);
    expect(component.find(RecordActions)).to.have.lengthOf(1);
  });

  it("renders valid props for RecordActions components", () => {
    const recordActionsProps = { ...component.find(RecordActions).props() };

    expect(component.find(RecordActions)).to.have.lengthOf(1);
    ["currentPage", "selectedRecords", "recordType", "mode", "showListActions"].forEach(property => {
      expect(recordActionsProps).to.have.property(property);
      delete recordActionsProps[property];
    });
    expect(recordActionsProps).to.be.empty;
  });

  describe("if doesn't have permission to create", () => {
    const propsUserWithoutPermssion = {
      title: "This is a record list toolbar",
      recordType: RECORD_PATH.cases,
      handleDrawer: () => {},
      mobileDisplay: false,
      currentPage: 0,
      css: { toolbar: "" }
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordListToolbar,
        propsUserWithoutPermssion,
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

    it("should render RecordListToolbar without AddRecordMenu", () => {
      expect(component.find(RecordListToolbar)).to.have.lengthOf(1);
      expect(component.find(AddRecordMenu)).to.have.lengthOf(0);
    });
  });

  it("should accept valid props", () => {
    const recordListToolbarProps = {
      ...component.find(RecordListToolbar).props()
    };

    expect(component.find(RecordListToolbar)).to.have.lengthOf(1);
    ["currentPage", "handleDrawer", "mobileDisplay", "recordType", "selectedRecords", "title", "css"].forEach(
      property => {
        expect(recordListToolbarProps).to.have.property(property);
        delete recordListToolbarProps[property];
      }
    );
    expect(recordListToolbarProps).to.be.empty;
  });
});
