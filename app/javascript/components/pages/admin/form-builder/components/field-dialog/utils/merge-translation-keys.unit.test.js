// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import mergeTranslationKeys from "./merge-translation-keys";

describe("mergeTranslationKeys", () => {
  const defaultValues = {
    id: 1,
    display_name: {
      en: "Hello",
      es: "",
      fr: "Test fr"
    },
    help_text: {
      en: "Help Text",
      es: "",
      fr: "Test fr"
    }
  };

  it("should return defaultValues if there are not currValues (first render)", () => {
    const expected = defaultValues;

    expect(mergeTranslationKeys(defaultValues, undefined)).toEqual(expected);
    expect(mergeTranslationKeys(defaultValues, {})).toEqual(expected);
  });

  describe("when isSubform is false", () => {
    it("should merge translatable keys into defaultValues for fields or subform fields", () => {
      const currentValues = {
        id: 1,
        display_name: {
          en: "Hello",
          es: "Hola",
          fr: ""
        },
        help_text: {
          en: "Help Text",
          es: "Texto de ayuda",
          fr: ""
        }
      };

      const expected = {
        id: 1,
        display_name: {
          en: "Hello",
          es: "Hola",
          fr: "Test fr"
        },
        help_text: {
          en: "Help Text",
          es: "Texto de ayuda",
          fr: "Test fr"
        }
      };

      expect(mergeTranslationKeys(defaultValues, currentValues)).toEqual(expected);
    });
  });

  describe("when isSubform is true", () => {
    it("should merge translatable keys into defaultValues  for subforms", () => {
      const defaultSubformValues = {
        id: 1,
        name: {
          en: "Name",
          es: "",
          fr: "Nom"
        },
        description: {
          en: "Description",
          es: "",
          fr: "Description"
        }
      };

      const currentValues = {
        id: 1,
        name: {
          en: "Name",
          es: "Nombre",
          fr: ""
        },
        description: {
          en: "Description",
          es: "Descripcion",
          fr: ""
        }
      };

      const expected = {
        id: 1,
        name: {
          en: "Name",
          es: "Nombre",
          fr: "Nom"
        },
        description: {
          en: "Description",
          es: "Descripcion",
          fr: "Description"
        }
      };

      expect(mergeTranslationKeys(defaultSubformValues, currentValues, true)).toEqual(expected);
    });
  });
});
