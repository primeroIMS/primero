import { form } from "./form";

describe("<AgencyForm /> - agencies-form/form", () => {
  const i18n = { t: () => "" };

  it("returns 11 fields", () => {
    const agencyForm = form(i18n);

    expect(agencyForm.size).to.be.equal(1);
    expect(agencyForm.first().fields).to.have.lengthOf(11);
  });
});
