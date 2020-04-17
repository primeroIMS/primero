import { Map } from "immutable";

import { FORM_MODE_NEW } from "../constants";

import { whichFormMode } from "./which-mode";

describe("whichFormMode()", () => {
  it("should build form state object", () => {
    const formMode = whichFormMode(FORM_MODE_NEW);

    const expected = Map({
      isShow: false,
      isNew: true,
      isEdit: false,
      isDialog: false
    });

    expect(formMode).to.deep.equal(expected);
  });
});