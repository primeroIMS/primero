import { fromJS } from "immutable";

import { SHOW_FIND_MATCH } from "../../../../../libs/permissions";
import { setupMountedComponent } from "../../../../../test";
import ActionButton from "../../../../action-button";

import SubformTraces from "./component";

describe("<RecordForm>/form/subforms/<SubformTraces>", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(SubformTraces, {
      openDrawer: true,
      formSection: { fields: [] },
      handleClose: () => {}
    }));
  });

  it("should render the subform traces", () => {
    expect(component.find(SubformTraces)).to.have.lengthOf(1);
  });

  it("should not render find match button if user does not have permission", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(2);
    expect(component.find(ActionButton).last().text()).to.equal("tracing_request.back_to_traces");
  });

  it("should render find match button if user has permission", () => {
    const { component: authComponent } = setupMountedComponent(
      SubformTraces,
      {
        openDrawer: true,
        formSection: { fields: [] },
        handleClose: () => {}
      },
      fromJS({
        user: { permissions: { tracing_requests: SHOW_FIND_MATCH } }
      })
    );

    expect(authComponent.find(ActionButton)).to.have.lengthOf(3);
    expect(authComponent.find(ActionButton).last().text()).to.equal("tracing_request.find_match");
  });
});
