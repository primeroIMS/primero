// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { FORM_MODE_NEW } from "../constants";

import { whichFormMode } from "./which-mode";

describe("whichFormMode()", () => {
  it("should build form state object", () => {
    const formMode = whichFormMode(FORM_MODE_NEW);
    const { isShow, isNew, isEdit, isDialog } = formMode;

    const expected = {
      isShow: false,
      isNew: true,
      isEdit: false,
      isDialog: false
    };

    const mode = {
      isShow,
      isNew,
      isEdit,
      isDialog
    };

    const modeViaGet = {
      isShow: formMode.get("isShow"),
      isNew: formMode.get("isNew"),
      isEdit: formMode.get("isEdit"),
      isDialog: formMode.get("isDialog")
    };

    expect(mode).toEqual(expected);
    expect(modeViaGet).toEqual(expected);
  });
});
