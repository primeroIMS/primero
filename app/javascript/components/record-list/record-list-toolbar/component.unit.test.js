import React from "react";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../test";
import { RECORD_TYPES, RECORD_PATH, MODULES } from "../../../config";
import { ACTIONS } from "../../../libs/permissions";
import { PrimeroModuleRecord } from "../../application/records";
import { ApplicationProvider } from "../../application/provider";
import RecordActions from "../../record-actions";
import AddRecordMenu from "../add-record-menu";

import RecordListToolbar from "./component";

describe("<RecordListToolbar />", () => {
  let component;
  const props = {
    title: "This is a record list toolbar",
    recordType: RECORD_PATH.cases,
    handleDrawer: () => {},
    mobileDisplay: false,
    currentPage: 0,
    selectedRecords: { 0: [0, 1] }
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
    }
  });
  // eslint-disable-next-line react/display-name
  const RecordListToolbarForm = () => {
    return (
      <ApplicationProvider>
        <RecordListToolbar {...props} />
      </ApplicationProvider>
    );
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(
      RecordListToolbarForm,
      props,
      initialState
    ));
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
    [
      "currentPage",
      "selectedRecords",
      "recordType",
      "iconColor",
      "mode",
      "showListActions"
    ].forEach(property => {
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
      currentPage: 0
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
          }
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
    [
      "currentPage",
      "handleDrawer",
      "mobileDisplay",
      "recordType",
      "selectedRecords",
      "title"
    ].forEach(property => {
      expect(recordListToolbarProps).to.have.property(property);
      delete recordListToolbarProps[property];
    });
    expect(recordListToolbarProps).to.be.empty;
  });
});
