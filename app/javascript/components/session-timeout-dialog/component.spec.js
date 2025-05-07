import { createMocks } from "react-idle-timer";
import { mountedComponent, screen, act, waitFor } from "test-utils";

import SessionTimeoutDialog from "./component";

describe("<SessionTimeoutDialog />", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    createMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("should idle after 15 minutes", async () => {
    mountedComponent(<SessionTimeoutDialog />, {
      application: {
        userIdle: false
      }
    });
    await act(() => jest.advanceTimersByTimeAsync(16 * 1000 * 60));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeInTheDocument();
    });
  });

  describe("when user is offline", () => {
    it("should not idle after 15 minutes", async () => {
      mountedComponent(<SessionTimeoutDialog />, {
        application: {
          userIdle: false
        },
        connectivity: {
          online: false
        }
      });
      await act(() => jest.advanceTimersByTimeAsync(16 * 1000 * 60));
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).toBeNull();
      });
    });
  });
});
