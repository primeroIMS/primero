import { fromJS } from "immutable";

import { ACTIONS } from "../../../libs/permissions";
import { setupMountedComponent } from "../../../test";

import ViewModal from "./component";

describe("<ViewModal />", () => {
  const currentRecord = fromJS({
    id: "03cdfdfe-a8fc-4147-b703-df976d200977",
    case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
    case_id_display: "9b4c525",
    name_first: "Name",
    name_last: "Last",
    name: "Name Last",
    owned_by: "primero"
  });

  const props = {
    close: () => {},
    openViewModal: true,
    currentRecord,
    recordType: "cases"
  };

  it("should render ViewModal", () => {
    const initialState = fromJS({
      user: { permissions: { cases: [] } }
    });

    const { component } = setupMountedComponent(ViewModal, props, initialState);

    expect(component.find(ViewModal)).to.have.lengthOf(1);
  });

  it("should not render the Request Transfer button if the user does not have permission", () => {
    const initialState = fromJS({
      user: { permissions: { cases: [] } }
    });

    const { component } = setupMountedComponent(ViewModal, props, initialState);
    const actionButtons = component.find(ViewModal).find("button");

    expect(actionButtons).to.have.lengthOf(1);
    expect(actionButtons.text()).to.not.equal("buttons.request_transfer");
  });

  it("should render the Request Transfer button if the user has permission", () => {
    const initialState = fromJS({
      user: { permissions: { cases: [ACTIONS.REQUEST_TRANSFER] } }
    });

    const { component } = setupMountedComponent(ViewModal, props, initialState);
    const actionButtons = component.find(ViewModal).find("button");

    expect(actionButtons).to.have.lengthOf(2);
    expect(actionButtons.last().text()).to.equal("buttons.request_transfer");
  });
});
