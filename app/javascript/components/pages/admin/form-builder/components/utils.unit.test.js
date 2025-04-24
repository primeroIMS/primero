// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import * as utils from "./utils";
import { MULTI_SELECT_FIELD, DATE_TIME_FIELD } from "./custom-field-selector-dialog/constants";

describe("getFieldsAttribute", () => {
  it("should return the correct fields attribute", () => {
    expect(utils.getFieldsAttribute(true)).toBe("subform_section.fields");
    expect(utils.getFieldsAttribute(false)).toBe("fields");
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

    expect(Object.keys(themeOverrides.MuiFormControl.root)).not.toHaveLength(0);
    expect(Object.keys(themeOverrides.MuiCheckbox.root)).not.toHaveLength(0);
    expect(Object.keys(themeOverrides.MuiFormControlLabel.root)).not.toHaveLength(0);
  });
});

describe("getLabelTypeField", () => {
  it("should return the correct label attribute", () => {
    expect(utils.getLabelTypeField(fromJS({ multi_select: true }))).toBe(MULTI_SELECT_FIELD);
    expect(utils.getLabelTypeField(fromJS({ date_include_time: true }))).toBe(DATE_TIME_FIELD);
    expect(utils.getLabelTypeField(fromJS({ type: "test" }))).toBe("test");
  });
});
