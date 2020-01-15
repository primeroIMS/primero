import React from "react";
import { expect } from "chai";
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
    mobileDisplay: false
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

  describe("if doesn't have permission to create", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        RecordListToolbar,
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

    it("should render RecordListToolbar without AddRecordMenu", () => {
      expect(component.find(RecordListToolbar)).to.have.lengthOf(1);
      expect(component.find(AddRecordMenu)).to.have.lengthOf(0);
    });
  });
});
