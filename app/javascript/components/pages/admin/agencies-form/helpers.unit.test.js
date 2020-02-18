import { expect } from "../../../../test/unit-test-helpers";

import { localizeData } from "./helpers";

describe("<AgenciesForm /> - Helpers", () => {
  it("localizeData should return the localized version of the field", () => {
    const i18n = { locale: "en" };
    const expected = { name: { en: "Name" } };
    const data = { name: "Name" };

    expect(localizeData(data, ["name"], i18n)).to.be.deep.equal(expected);
  });
});
