import { List } from "immutable";

import { setupMountedComponent, expect } from "../../../test";
import { ActionDialog } from "../../action-dialog";
import Form from "../../form";
import { RECORD_PATH } from "../../../config";

import Exports from "./component";

describe("<RecordActions /> - <Exports />", () => {
  const props = {
    openExportsDialog: true,
    close: () => {},
    recordType: RECORD_PATH.cases,
    userPermissions: List(["manage"])
  };

  it("renders ActionDialog", () => {
    const { component } = setupMountedComponent(Exports, props, {});

    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("renders Form", () => {
    const { component } = setupMountedComponent(Exports, props, {});

    expect(component.find(Form)).to.have.lengthOf(1);
  });
});
