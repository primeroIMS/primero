import { fromJS } from "immutable";

import { selectDialog, selectDialogPending } from "./selectors";

const stateWithDialogs = fromJS({
  ui: {
    dialogs: {
      requestApproval: true,
      pending: true
    }
  }
});

describe("<RecordActions /> - Selectors", () => {
  describe("selectDialog", () => {
    it("should return dialog open status", () => {
      const openDialog = selectDialog(stateWithDialogs, "requestApproval");

      expect(openDialog).to.equal(true);
    });
  });

  describe("selectDialogPending", () => {
    it("should return dialog pending status", () => {
      const pendingDialog = selectDialogPending(stateWithDialogs);

      expect(pendingDialog).to.equal(true);
    });
  });
});
