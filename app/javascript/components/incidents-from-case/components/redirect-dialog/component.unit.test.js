import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import ActionDialog from "../../../action-dialog";
import { RECORD_TYPES } from "../../../../config";

import RedirectDialog from "./component";

describe("<RedirectDialog /> - Component", () => {
  let component;
  const props = {
    handleSubmit: () => {},
    incidentPath: "",
    mode: { isShow: false, isEdit: true },
    open: true,
    recordType: RECORD_TYPES.cases,
    setFieldValue: () => {},
    setRedirectOpts: () => {}
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(RedirectDialog, props, fromJS({})));
  });

  it("render RedirectDialog component", () => {
    expect(component.find(RedirectDialog)).to.have.length(1);
  });

  it("render a ActionDialog", () => {
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const redirectDialogProps = { ...component.find(RedirectDialog).props() };

    ["handleSubmit", "incidentPath", "mode", "open", "recordType", "setFieldValue", "setRedirectOpts"].forEach(
      property => {
        expect(redirectDialogProps).to.have.property(property);
        delete redirectDialogProps[property];
      }
    );
    expect(redirectDialogProps).to.be.empty;
  });
});
