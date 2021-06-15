import getDefaultForms from "./get-default-forms";

describe("getDefaultForms", () => {
  const i18n = { t: value => value };

  it("should return the default forms", () => {
    expect(Object.keys(getDefaultForms(i18n)).length).to.equal(7);
  });
});
