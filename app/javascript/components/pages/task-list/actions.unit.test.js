import { expect } from "chai";
import clone from "lodash/clone";

import * as Actions from "./actions";

describe("<TaskList /> - Actions", () => {
  const actions = clone(Actions);

  it("should have known properties", () => {
    expect(actions).to.be.an("object");
    [
      "TASKS",
      "TASKS_STARTED",
      "TASKS_SUCCESS",
      "TASKS_FINISHED",
      "TASKS_FAILURE"
    ].forEach(property => {
      expect(actions).to.have.property(property);
      delete actions[property];
    });

    expect(actions).to.be.empty;
  });
});
