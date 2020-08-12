import { fromJS } from "immutable";
import { Router } from "react-router-dom";

import { setupMountedComponent } from "../../../test";
import ActionButton from "../../action-button";

import CreateRecordDialog from "./component";

describe("<CreateRecordDialog /> record-list/create-record-dialog", () => {
  const props = {
    open: true,
    setOpen: () => {},
    moduleUniqueId: "testmodule-1",
    recordType: "cases"
  };

  const state = fromJS({
    records: {
      cases: {
        data: [{ unique_id: "testcase-1" }]
      }
    }
  });

  it("renders a <CreateRecordDialog />", () => {
    const { component } = setupMountedComponent(CreateRecordDialog, props, state);

    expect(component.find(CreateRecordDialog)).to.have.lengthOf(1);
  });

  it("redirects to new case if create new case is clicked", () => {
    const { component } = setupMountedComponent(CreateRecordDialog, props, state);

    component.find(CreateRecordDialog).find(ActionButton).first().props().rest.onClick();

    const { history } = component.find(Router).props();

    expect(history.action).to.equal("PUSH");
    expect(history.location.pathname).to.equal("/cases/testmodule-1/new");
  });
});
