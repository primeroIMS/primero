import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../test";
import ActionDialog from "../../action-dialog";
import Form from "../../form";
import { RECORD_PATH } from "../../../config";

import Exports from "./component";

describe("<RecordActions /> - <Exports />", () => {
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
    }
  });
  const props = {
    openExportsDialog: true,
    close: () => {},
    recordType: RECORD_PATH.cases,
    userPermissions: fromJS(["manage"])
  };

  it("renders ActionDialog", () => {
    const { component } = setupMountedComponent(Exports, props, state);

    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("renders Form", () => {
    const { component } = setupMountedComponent(Exports, props, state);

    expect(component.find(Form)).to.have.lengthOf(1);
  });

  it("should accept valid props", () => {
    const validProps = {
      ...props,
      currentPage: 0,
      pending: true,
      record: {},
      selectedRecords: { 0: [0] },
      setPending: () => {}
    };
    const { component } = setupMountedComponent(Exports, validProps, state);
    const exportProps = {
      ...component.find(Exports).props()
    };

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
