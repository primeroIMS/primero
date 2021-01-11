import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../../../test";
import { SHOW_FIND_MATCH } from "../../../../../../../libs/permissions";
import ActionButton from "../../../../../../action-button";

import TraceActions from "./component";

describe("<RecordForm>/form/subforms/<TraceActions>", () => {
  const props = { handleBack: () => {}, handleConfirm: () => {} };

  it("should not render find match button if user does not have permission", () => {
    const { component } = setupMountedComponent(TraceActions, props, fromJS([]));

    expect(component.find(ActionButton)).to.have.lengthOf(1);
    expect(component.find(ActionButton).last().text()).to.equal("tracing_request.back_to_traces");
  });

  it("should render find match button if user has permission", () => {
    const { component } = setupMountedComponent(
      TraceActions,
      props,
      fromJS({
        user: { permissions: { tracing_requests: SHOW_FIND_MATCH } }
      })
    );

    expect(component.find(ActionButton)).to.have.lengthOf(2);
    expect(component.find(ActionButton).last().text()).to.equal("tracing_request.find_match");
  });
});
