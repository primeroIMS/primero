import { fromJS } from "immutable";
import sinon from "sinon";
import { createMocks } from "react-idle-timer";

import { mountedComponent, screen } from "../../test-utils";

import SessionTimeoutDialog from "./component";

describe("<SessionTimeoutDialog />", () => {
  let component;
  let clock;

  clock = sinon.useFakeTimers();
  createMocks();
  it("should idle after 15 minutes", () => {
    mountedComponent(<SessionTimeoutDialog />,  fromJS({
        application: {
          userIdle: false
        }
      }))
 
    expect(screen.queryByRole('dialog')).toBeNull()

  });

  describe("when user is offline", () => {
    it("should not idle after 15 minutes", () => {
        mountedComponent(<SessionTimeoutDialog />,  fromJS({
            application: {
              userIdle: false
            },
            connectivity: {
                online: false
              }
          }))
  
          expect(screen.queryByRole('dialog')).toBeNull()
     
    });
  });
});
