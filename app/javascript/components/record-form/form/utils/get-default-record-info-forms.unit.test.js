import getDefaultRecordInfoForms from "./get-default-record-info-forms";

describe("getDefaultRecordInfoForms", () => {
  const i18n = { t: value => value };

  it("should return all the record information forms", () => {
    expect(Object.keys(getDefaultRecordInfoForms(i18n)).length).to.equal(6);
  });
});
