import { SEPERATOR, TEXT_FIELD } from "../../constants";

import getViolationFieldForGuidance from "./get-violation-field-for-guidance";

describe("getViolationFieldForGuidance", () => {
  it("should return a field if separator and it's the first one", () => {
    expect(getViolationFieldForGuidance([{ type: SEPERATOR }, { type: TEXT_FIELD }])).to.be.deep.equal({
      type: SEPERATOR
    });
  });
  it("should return an empty object if it is no a separator", () => {
    expect(getViolationFieldForGuidance([{ type: TEXT_FIELD }])).to.be.deep.equal({});
  });
});
