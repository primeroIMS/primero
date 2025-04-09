// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { localizeData, translateFields } from "./utils";

describe("<AgenciesForm /> - Helpers", () => {
  it("localizeData should return the localized version of the field", () => {
    const i18n = { locale: "en" };
    const expected = { name: { en: "Name" } };
    const data = { name: "Name" };

    expect(localizeData(data, ["name"], i18n)).toEqual(expected);
  });

  it("translateFields should return the field with the current translation", () => {
    const i18n = { locale: "en" };
    const expected = { name: "Name" };
    const data = { name: { en: "Name" } };

    expect(translateFields(data, ["name"], i18n)).toEqual(expected);
  });
});
