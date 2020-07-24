import * as forms from "./forms";

describe("<CreateRecordDialog /> - forms", () => {
  const i18n = { t: value => value };

  it("searchForm should return an object", () => {
    expect(forms.searchForm(i18n)).to.be.an("object");
  });
});
