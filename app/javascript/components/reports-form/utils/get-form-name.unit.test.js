import getFormName from "./get-form-name";

describe("<ReportForm>/utils/getFormName()", () => {
  it("returns the form name if the selectedRecordType starts with the word reportable", () => {
    const expected = "services";

    expect(getFormName("reportable_service")).to.deep.equal(expected);
  });

  it("returns empty string if the selectedRecordType does not starts with the word reportable", () => {
    expect(getFormName("test")).to.be.empty;
  });
});
