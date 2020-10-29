import { Map } from "immutable";
import sinon from "sinon";
import isEqual from "lodash/isEqual";

import { setupMountedComponent } from "../../test";
import { setUserIdle } from "../application/action-creators";

import SessionTimeoutDialog from "./component";

describe("<SessionTimeoutDialog />", () => {
  let component;
  let clock;

  before(() => {
    clock = sinon.useFakeTimers();

    component = setupMountedComponent(
      SessionTimeoutDialog,
      {},
      Map({
        application: Map({
          userIdle: false
        })
      })
    ).component;
  });

  it("should idle after 15 minutes", () => {
    const idleAction = setUserIdle(true);

    expect(
      component
        .props()
        .store.getActions()
        .some(action => isEqual(action, idleAction))
    ).to.equal(false);
    clock.tick(16 * 1000 * 60);
    expect(
      component
        .props()
        .store.getActions()
        .some(action => isEqual(action, idleAction))
    ).to.equal(true);
  });
});
