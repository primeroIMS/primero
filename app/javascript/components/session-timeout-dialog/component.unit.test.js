import { Map } from "immutable";
import sinon from "sinon";
import IdleTimer from "react-idle-timer";

import { setupMountedComponent } from "../../test";

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
    const idleTimer = component.find(IdleTimer);

    expect(idleTimer.state().idle).to.equal(false);
    clock.tick(16 * 1000 * 60);
    expect(idleTimer.state().idle).to.equal(true);
  });
});
