import { isDisabledAction } from "./utils";
import { ENABLED_FOR_ONE, ENABLED_FOR_ONE_MANY_ALL } from "./constants";

describe("<RecordActions /> - utils", () => {
  const enabledFor = ENABLED_FOR_ONE;
  const totaRecords = 10;

  it("should return true when the actions is not enabled", () => {
    const selectedRecords = { 0: [1, 5, 9] };

    expect(isDisabledAction(enabledFor, selectedRecords, totaRecords)).to.be
      .true;
  });

  it("should return false when the actions is enabled", () => {
    const selectedRecords = { 0: [4] };

    expect(isDisabledAction(enabledFor, selectedRecords, totaRecords)).to.be
      .false;
  });

  it("should return true when the selectedRecords is empty and there are not records", () => {
    const selectedRecords = {};

    expect(isDisabledAction(ENABLED_FOR_ONE_MANY_ALL, selectedRecords, 0)).to.be
      .true;
  });
});
