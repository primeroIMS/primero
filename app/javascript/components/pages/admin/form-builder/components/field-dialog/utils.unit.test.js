import { fromJS } from "immutable";

import { TEXT_FIELD } from "../../../../../form";

import * as utils from "./utils";

describe("getFormField", () => {
  const i18n = { t: value => value };

  it("should return the form sections", () => {
    const formSections = utils.getFormField(
      fromJS({
        type: TEXT_FIELD,
        name: "owned_by"
      }),
      i18n
    );

    expect(formSections.forms.size).to.be.equal(2);
  });
});

describe("addWithIndex", () => {
  it("should add an element on an specific index array", () => {
    const original = ["a", "b", "c"];
    const expected = ["a", "b", "d", "c"];

    expect(utils.addWithIndex(original, 2, "d")).to.deep.equals(expected);
  });
});
