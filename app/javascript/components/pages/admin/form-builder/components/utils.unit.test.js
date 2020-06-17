import { fromJS } from "immutable";

import * as utils from "./utils";
import {
  MULTI_SELECT_FIELD,
  DATE_TIME_FIELD
} from "./custom-field-selector-dialog/constants";

describe("getFieldsAttribute", () => {
  it("should return the correct fields attribute", () => {
    expect(utils.getFieldsAttribute(true)).to.equal("subform_section.fields");
    expect(utils.getFieldsAttribute(false)).to.equal("fields");
  });
});

describe("getFiedListItemTheme", () => {
  it("should return the overrides for the theme", () => {
    const themeOverrides = utils.getFiedListItemTheme({
      overrides: {
        MuiFormControl: { root: {} },
        MuiCheckbox: { root: {} },
        MuiFormControlLabel: { root: {} }
      }
    }).overrides;

    expect(Object.keys(themeOverrides.MuiFormControl.root)).to.not.be.empty;
    expect(Object.keys(themeOverrides.MuiCheckbox.root)).to.not.be.empty;
    expect(Object.keys(themeOverrides.MuiFormControlLabel.root)).to.not.be
      .empty;
  });
});

describe("getLabelTypeField", () => {
  it("should return the correct label attribute", () => {
    expect(utils.getLabelTypeField(fromJS({ multi_select: true }))).to.equal(
      MULTI_SELECT_FIELD
    );
    expect(
      utils.getLabelTypeField(fromJS({ date_include_time: true }))
    ).to.equal(DATE_TIME_FIELD);
    expect(utils.getLabelTypeField(fromJS({ type: "test" }))).to.equal("test");
  });
});
