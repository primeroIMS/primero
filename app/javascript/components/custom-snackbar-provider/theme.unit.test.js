import * as theme from "./theme";

describe("<CustomSnackbarProvider /> - theme", () => {
  const themeValues = { ...theme };

  it("should known the values", () => {
    expect(theme).to.be.an("object");
    ["snackVariantClasses"].forEach(property => {
      expect(themeValues).to.have.property(property);
      delete themeValues[property];
    });
    expect(themeValues).to.be.empty;
  });

  it("snackVariantClasses should known the classes for the snackbar", () => {
    const currentTheme = { primero: { colors: {} } };
    const classes = { ...theme.snackVariantClasses(currentTheme) };

    expect(classes).to.be.an("object");

    ["lessPadding", "success", "error", "warning", "info"].forEach(property => {
      expect(classes).to.have.property(property);
      delete classes[property];
    });
    expect(classes).to.be.empty;
  });
});
