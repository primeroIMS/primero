import { fromJS } from "immutable";
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
      fromJS({
        application: {
          userIdle: false
        }
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

  describe("when user is offline", () => {
    before(() => {
      clock = sinon.useFakeTimers();

      component = setupMountedComponent(
        SessionTimeoutDialog,
        {},
        fromJS({
          application: {
            userIdle: false
          },
          connectivity: {
            online: false
          }
        })
      ).component;
    });

    it("should not idle after 15 minutes", () => {
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
      ).to.equal(false);
    });
  });
});
