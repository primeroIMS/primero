import * as utils from "./utils";

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
