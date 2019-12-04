import { expect } from "chai";
import clone from "lodash/clone";

import * as index from "./index";

describe("<Dashboard /> - index", () => {
  const indexValues = clone(index);

  it("should have known properties", () => {
    expect(indexValues).to.be.an("object");
    [
      "BadgedIndicator",
      "DashboardTable",
      "DoughnutChart",
      "FlagBox",
      "LineChart",
      "OptionsBox",
      "OverviewBox",
      "ActionMenu",
      "DashboardChip"
    ].forEach(property => {
      expect(indexValues).to.have.property(property);
      delete indexValues[property];
    });

    expect(indexValues).to.be.empty;
  });
});
