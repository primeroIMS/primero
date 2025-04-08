// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { selectDialog, selectDialogPending } from "./selectors";

const stateWithDialogs = fromJS({
  ui: {
    dialogs: {
      dialog: "requestApproval",
      pending: true
    }
  }
});

describe("<RecordActions /> - Selectors", () => {
  describe("selectDialog", () => {
    it("should return dialog open status", () => {
      const openDialog = selectDialog(stateWithDialogs, "requestApproval");

      expect(
        openDialog.equals(
          fromJS({
            dialog: "requestApproval",
            pending: true
          })
        )
      ).toBe(true);
    });
  });

  describe("selectDialogPending", () => {
    it("should return dialog pending status", () => {
      const pendingDialog = selectDialogPending(stateWithDialogs);

      expect(pendingDialog).toBe(true);
    });
  });
});
