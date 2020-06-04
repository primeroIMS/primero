/* eslint-disable import/prefer-default-export */

export const getFiedListItemTheme = currentTheme => ({
  ...currentTheme,
  overrides: {
    ...currentTheme.overrides,
    MuiFormControl: {
      ...currentTheme.overrides.MuiFormControl,
      root: {
        ...currentTheme.overrides.MuiFormControl.root,
        marginBottom: 0
      }
    },
    MuiCheckbox: {
      ...currentTheme.overrides.MuiCheckbox,
      root: {
        ...currentTheme.overrides.MuiCheckbox.root,
        padding: "0 0.2em",
        margin: "0 0.4em"
      }
    },
    MuiFormControlLabel: {
      root: {
        ...currentTheme.overrides.MuiFormControlLabel.root,
        marginLeft: 0,
        marginRight: 0
      }
    }
  }
});
