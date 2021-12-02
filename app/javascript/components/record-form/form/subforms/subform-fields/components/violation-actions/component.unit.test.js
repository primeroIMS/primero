import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../../../test";
import ActionButton from "../../../../../../action-button";

import ViolationActions from "./component";

describe("<RecordForm>/form/subforms/subform-fields/<ViolationActions>", () => {
  it("should render back to violations button", () => {
    const { component } = setupMountedComponent(ViolationActions, { handleBack: () => {} }, fromJS([]));

    expect(component.find(ActionButton)).to.have.lengthOf(1);
    expect(component.find(ActionButton).last().text()).to.equal("incident.violation.back_to_violations");
  });
});
