import clone from "lodash/clone";

import * as actions from "./actions";

describe("<Nav /> - Actions", () => {
  const actionsNav = clone(actions);

  it("should have known properties", () => {
    expect(actions).to.be.an("object");
    ["OPEN_DRAWER", "FETCH_ALERTS", "FETCH_ALERTS_SUCCESS"].forEach(
      property => {
        expect(actionsNav).to.have.property(property);
        delete actionsNav[property];
      }
    );

    expect(actionsNav).to.be.empty;
  });
});
