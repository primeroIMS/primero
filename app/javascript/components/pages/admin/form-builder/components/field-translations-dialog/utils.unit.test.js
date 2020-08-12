import { fromJS } from "immutable";

import * as utils from "./utils";

describe("<FieldTranslationsDialog>- Utils", () => {
  it("should have known properties", () => {
    const clonedActions = { ...utils };

    ["buildDefaultOptionStringsText"].forEach(property => {
      expect(clonedActions).to.have.property(property);
      delete clonedActions[property];
    });

    expect(clonedActions).to.be.empty;
  });

  describe("buildDefaultOptionStringsText", () => {
    const options = {
      en: [{ id: "option_1", display_text: "Option 1" }]
    };
    const expected = {
      ...options,
      es: [{ id: "option_1", display_text: "" }]
    };
    const locales = fromJS([{ id: "en" }, { id: "es" }]);

    expect(expected).to.deep.equal(utils.buildDefaultOptionStringsText(options, locales));
  });
});
