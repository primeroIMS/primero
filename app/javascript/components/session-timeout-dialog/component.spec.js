import { fromJS } from "immutable";
import { createMocks } from "react-idle-timer";
import { mountedComponent, screen, act, waitFor } from "test-utils";

import SessionTimeoutDialog from "./component";

describe("<SessionTimeoutDialog />", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    createMocks();
  });

  it("should idle after 15 minutes", async () => {
    mountedComponent(<SessionTimeoutDialog />, {
      application: {
        userIdle: false
      }
    });
    await act(() => jest.advanceTimersByTimeAsync(18 * 1000 * 60));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("when user is offline", () => {
    it("should not idle after 15 minutes", () => {
      mountedComponent(
        <SessionTimeoutDialog />,
        fromJS({
          application: {
            userIdle: false
          },
          connectivity: {
            online: false
          }
        })
      );

      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });
});
