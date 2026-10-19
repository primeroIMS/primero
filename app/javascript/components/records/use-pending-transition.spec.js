import { fromJS } from "immutable";

import { setupHook } from "../../test-utils";

import usePendingTransition from "./use-pending-transition";

describe("records - usePendingTransition", () => {
  const state = { user: { username: "user_1" } };

  describe("when the current user has a pending referral", () => {
    const record = fromJS({ id: "123", referred_users_pending: ["user_1"] });

    it("flags the pending referral", () => {
      const { result } = setupHook(() => usePendingTransition(record), state);

      expect(result.current.hasPendingReferral).toBe(true);
      expect(result.current.hasPendingTransfer).toBe(false);
      expect(result.current.hasPendingTransition).toBe(true);
    });

    it("returns the referral restriction message", () => {
      const { result } = setupHook(() => usePendingTransition(record), state);

      expect(result.current.tooltip).toBe("referral.pending_restriction");
    });
  });

  describe("when the current user has a pending transfer", () => {
    const record = fromJS({ id: "123", transferred_to_users: ["user_1"] });

    it("flags the pending transfer", () => {
      const { result } = setupHook(() => usePendingTransition(record), state);

      expect(result.current.hasPendingReferral).toBe(false);
      expect(result.current.hasPendingTransfer).toBe(true);
      expect(result.current.hasPendingTransition).toBe(true);
    });

    it("returns the transfer restriction message", () => {
      const { result } = setupHook(() => usePendingTransition(record), state);

      expect(result.current.tooltip).toBe("transfer.pending_restriction");
    });
  });

  describe("when the current user has no pending transition", () => {
    const record = fromJS({ id: "123", referred_users_pending: ["user_2"], transferred_to_users: ["user_3"] });

    it("returns no restriction", () => {
      const { result } = setupHook(() => usePendingTransition(record), state);

      expect(result.current.hasPendingTransition).toBe(false);
      expect(result.current.tooltip).toBeUndefined();
    });
  });

  it("returns no restriction when there is no record", () => {
    const { result } = setupHook(() => usePendingTransition(undefined), state);

    expect(result.current.hasPendingTransition).toBe(false);
    expect(result.current.tooltip).toBeUndefined();
  });
});
