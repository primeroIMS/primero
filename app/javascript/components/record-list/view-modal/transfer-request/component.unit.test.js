import { expect } from "chai";
import { Formik } from "formik";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { ActionDialog } from "../../../action-dialog";

import TransferRequest from "./component";

describe("<TransferRequest />", () => {
  let component;
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
    caseId: "1234",
    currentRecord,
    open: true,
    setOpen: () => {}
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(TransferRequest, props, {}));
  });

  it("should render ActionDialog", () => {
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("should render Formik", () => {
    expect(component.find(Formik)).to.have.lengthOf(1);
  });

  it("should accept valid props", () => {
    const transferRequestProps = { ...component.find(TransferRequest).props() };

    expect(component.find(TransferRequest)).to.have.lengthOf(1);
    ["caseId", "currentRecord", "open", "setOpen"].forEach(property => {
      expect(transferRequestProps).to.have.property(property);
      delete transferRequestProps[property];
    });
    expect(transferRequestProps).to.be.empty;
  });
});
