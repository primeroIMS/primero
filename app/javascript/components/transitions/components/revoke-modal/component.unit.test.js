import { fromJS } from "immutable";

import { expect, setupMountedComponent } from "../../../../test";
import { ActionDialog } from "../../../action-dialog";

import RevokeModal from "./component";

describe("<RevokeModal /> - Component", () => {
  let component;
  const props = {
    name: "transferModal-1",
    close: () => {},
    open: true,
    pending: false,
    recordType: "cases",
    setPending: () => {},
    transition: {
      id: "1",
      record_id: "5a291f55-c92a-4786-be2a-13b98fd143e1",
      record_type: "case",
      created_at: "2020-02-14T23:00:35.345Z",
      notes: "",
      rejected_reason: "",
      status: "in_progress",
      type: "Transfer",
      consent_overridden: true,
      consent_individual_transfer: false,
      transitioned_by: "primero_admin_cp",
      transitioned_to: "primero_cp_ar",
      service: "legal_assistance_service"
    }
  };
  const state = fromJS({});

  beforeEach(() => {
    ({ component } = setupMountedComponent(RevokeModal, props, state));
  });

  it("renders ActionDialog component", () => {
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });
});
