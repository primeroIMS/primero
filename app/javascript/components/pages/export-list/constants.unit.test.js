import { expect } from "../../../test";

import * as constants from "./constants";

describe("<ExportList /> - pages/export-list/constants", () => {
  it("should have known constants", () => {
    const clone = { ...constants };

    ["NAME", "EXPORT_URL", "EXPORT_STATUS", "EXPORT_COLUMNS"].forEach(
      property => {
        expect(clone).to.have.property(property);
        delete clone[property];
      }
    );

    expect(clone).to.be.empty;
  });
});
