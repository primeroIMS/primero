// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { setupHook } from "../../test-utils";

import { ACTIONS } from "./constants";
import usePermissions from "./use-permissions";

describe("Verifying config constant", () => {
  it("handles single resource permission check", () => {
    const { result } = setupHook(() => usePermissions("cases", [ACTIONS.MANAGE]), {
      user: {
        permissions: {
          cases: [ACTIONS.MANAGE]
        }
      }
    });

    expect(result.current).toBe(true);
  });

  it("handles multiple resources permission checks", () => {
    const expected = {
      canApprove: true,
      canDelete: true,
      canManageCase: false,
      permittedAbilities: fromJS(["approve_assessment", "delete"])
    };

    const { result } = setupHook(
      () =>
        usePermissions("cases", {
          canManageCase: [ACTIONS.READ],
          canApprove: [
            ACTIONS.MANAGE,
            ACTIONS.APPROVE_ASSESSMENT,
            ACTIONS.APPROVE_CASE_PLAN,
            ACTIONS.APPROVE_CLOSURE,
            ACTIONS.APPROVE_ACTION_PLAN,
            ACTIONS.APPROVE_GBV_CLOSURE
          ],
          canDelete: [ACTIONS.DELETE]
        }),
      {
        user: {
          permissions: {
            cases: [ACTIONS.APPROVE_ASSESSMENT, ACTIONS.DELETE]
          }
        }
      }
    );

    expect(result.current).toStrictEqual(expected);
  });
});
