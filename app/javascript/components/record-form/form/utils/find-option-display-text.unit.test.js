import { fromJS } from "immutable";

import { CUSTOM_STRINGS_SOURCE } from "../constants";

import findOptionDisplayText from "./find-option-display-text";

describe("findOptionDisplayText", () => {
  it("should return the display text for agency option", () => {
    const i18n = { locale: "en" };
    const agencies = fromJS([{ id: "agency-1", name: "Agency 1" }]);
    const customLookups = [CUSTOM_STRINGS_SOURCE.agency];

    const displayText = findOptionDisplayText({
      agencies,
      customLookups,
      i18n,
      option: CUSTOM_STRINGS_SOURCE.agency,
      options: [],
      value: "agency-1"
    });

    expect(displayText).to.be.equal("Agency 1");
  });
});
