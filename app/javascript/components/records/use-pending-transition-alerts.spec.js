import { fromJS } from "immutable";

import { setupHook } from "../../test-utils";
import { MODULES } from "../../config";

import usePendingTransitionAlerts from "./use-pending-transition-alerts";

describe("records - usePendingTransitionAlerts", () => {
  const state = {
    user: { username: "user_1" },
    application: {
      modules: [{ unique_id: MODULES.CP, options: { pending_transition_to_form: { referral: "basic_identity" } } }]
    }
  };

  it("returns an alert on the configured form when the current user has a pending referral", () => {
    const record = fromJS({ id: "123", referred_users_pending: ["user_1"] });

    const { result } = setupHook(() => usePendingTransitionAlerts(record, MODULES.CP), state);

    expect(result.current).toEqual(fromJS([{ type: "referral", form_unique_id: "basic_identity" }]));
  });

  it("returns no alerts when the current user is not the pending recipient", () => {
    const record = fromJS({ id: "123", referred_users_pending: ["user_2"] });

    const { result } = setupHook(() => usePendingTransitionAlerts(record, MODULES.CP), state);

    expect(result.current).toEqual(fromJS([]));
  });

  it("returns no alerts when the module has no form configured for the transition", () => {
    const record = fromJS({ id: "123", referred_users_pending: ["user_1"] });

    const { result } = setupHook(() => usePendingTransitionAlerts(record, MODULES.GBV), state);

    expect(result.current).toEqual(fromJS([]));
  });

  it("returns no alerts when there is no record", () => {
    const { result } = setupHook(() => usePendingTransitionAlerts(undefined, MODULES.CP), state);

    expect(result.current).toEqual(fromJS([]));
  });
});
