import { fromJS } from "immutable";
import { CircularProgress, Fab } from "@material-ui/core";

import { expect, setupMountedComponent, stub } from "../../../test";
import { RECORD_PATH, RECORD_TYPES, MODULES } from "../../../config";
import { ACTIONS } from "../../../libs/permissions";
import { PrimeroModuleRecord } from "../../application/records";

import { WorkflowIndicator } from "./components";
import RecordFormToolbar from "./record-form-toolbar";

describe("<RecordFormToolbar />", () => {
  const mode = {
    isNew: false,
    isEdit: true,
    isShow: false
  };

  const params = {
    recordType: RECORD_PATH.cases,
    id: "ca1c1365-3be6-427f-9b56-000e35e2ef20"
  };

  const record = fromJS({
    record_state: true,
    sex: "female",
    owned_by_agency_id: 1,
    notes_section: [],
    date_of_birth: "2013-02-11",
    record_in_scope: true,
    case_id: "9bd46317-e4dc-4f99-a0ae-e03be6965869",
    created_at: "2020-02-11T13:53:09.345Z",
    date_closure: "2020-02-11",
    name_last: "tercero",
    name: "martes tercero",
    alert_count: 0,
    previously_owned_by: "primero_cp",
    case_id_display: "6965869",
    created_by: "primero_cp",
    module_id: "primeromodule-cp",
    owned_by: "primero_cp",
    reopened_logs: [
      {
        reopened_date: "2020-02-11T13:54:38.265Z",
        reopened_user: "primero_mgr_cp"
      }
    ],
    status: "open",
    registration_date: "2020-02-11",
    complete: true,
    case_status_reopened: true,
    type: "cases",
    id: "b4db8e58-f7c8-4b89-b92f-507c32d8aaf0",
    flag_count: 0,
    name_first: "martes",
    short_id: "6965869",
    age: 7,
    workflow: "reopened"
  });

  const props = {
    mode,
    params,
    record,
    recordType: RECORD_TYPES[RECORD_PATH.cases],
    shortId: record.get("short_id"),
    primeroModule: MODULES.CP,
    handleFormSubmit: stub()
  };

  const initialState = {
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
          workflows: {
            case: {
              en: [
                {
                  id: "new",
                  display_text: "New"
                },
                {
                  id: "reopened",
                  display_text: "Reopened"
                }
              ]
            }
          }
        })
      ]
    },
    user: {
      modules: [MODULES.CP],
      permissions: {
        cases: [ACTIONS.CREATE]
      }
    }
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      RecordFormToolbar,
      props,
      fromJS(initialState)
    ));
  });

  it("renders a RecordFormToolbar/>", () => {
    expect(component.find(RecordFormToolbar)).to.have.lengthOf(1);
    expect(component.find(Fab)).to.have.lengthOf(2);
  });

  it("renders a <WorkflowIndicator /> component, when record is enabled", () => {
    expect(component.find(WorkflowIndicator)).to.have.lengthOf(1);
  });

  it("renders 'Case is disabled' text, when record is disabled", () => {
    const { component: recordFormToolbarComponent } = setupMountedComponent(
      RecordFormToolbar,
      { ...props, record: fromJS({ record_state: false }) },
      fromJS(initialState)
    );

    expect(recordFormToolbarComponent.find(WorkflowIndicator)).to.be.empty;
    expect(recordFormToolbarComponent.find("h3").text()).to.be.equals(
      "case.messages.case_disabled"
    );
  });

  describe("when records is being save", () => {
    let component;

    const initialStateSavingRecord = fromJS({
      ...initialState,
      records: {
        cases: {
          saving: true
        }
      }
    });

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordFormToolbar,
        props,
        fromJS(initialStateSavingRecord)
      ));
    });

    it("renders a RecordFormToolbar/>", () => {
      expect(component.find(RecordFormToolbar)).to.have.lengthOf(1);
      expect(component.find(CircularProgress)).to.have.lengthOf(1);
    });
  });
});
