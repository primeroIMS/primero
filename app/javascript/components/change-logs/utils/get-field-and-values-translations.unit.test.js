import { Map } from "immutable";

import getFieldAndValuesTranslations from "./get-field-and-values-translations";

describe("<ChangeLogs>/utils/getFieldAndValuesTranslations", () => {
  it("should return the translation for the specified locale ", () => {
    const field = Map({
      display_name: {
        en: "Field Name 1",
        es: "Nombre del Campo 1"
      }
    });

    expect(getFieldAndValuesTranslations([], [], [], { locale: "es" }, field, {}, {}).fieldDisplayName).to.equal(
      "Nombre del Campo 1"
    );
  });

  it("should return the english translation if the translation is not avaiable ", () => {
    const field = Map({ display_name: { en: "Field Name 1", es: "" } });

    expect(getFieldAndValuesTranslations([], [], [], { locale: "es" }, field, {}, {}).fieldDisplayName).to.equal(
      "Field Name 1"
    );
  });
});
