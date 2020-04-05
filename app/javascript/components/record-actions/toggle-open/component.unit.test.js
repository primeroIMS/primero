import { expect } from "chai";
import { fromJS } from "immutable";

import ActionDialog from "../../action-dialog";
import { setupMountedComponent } from "../../../test";
import { RECORD_PATH } from "../../../config";

import ToggleOpen from "./component";

describe("<ToggleOpen />", () => {
  let component;

  const record = fromJS({
    id: "03cdfdfe-a8fc-4147-b703-df976d200977",
    case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
    case_id_display: "9b4c525",
    name_first: "Test",
    name_last: "Case",
    name: "Test Case"
  });

  const props = {
    close: () => {},
    openReopenDialog: true,
    recordType: RECORD_PATH.cases,
    record
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(ToggleOpen, props, {}));
  });

  it("renders ToggleOpen", () => {
    expect(component.find(ToggleOpen)).to.have.length(1);
  });

  it("renders ActionDialog", () => {
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("renders component with valid props", () => {
    const toggleOpenProps = { ...component.find(ToggleOpen).props() };

    ["close", "openReopenDialog", "record", "recordType"].forEach(property => {
      expect(toggleOpenProps).to.have.property(property);
      delete toggleOpenProps[property];
    });
    expect(toggleOpenProps).to.be.empty;
  });
});
