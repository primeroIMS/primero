import { fromJS } from "immutable";

import { setupHook } from "../../test/utils";

import * as PERMISSIONS from "./constants";
import usePermissions from "./use-permissions";

describe("Verifying config constant", () => {
  it("handles single resource permission check", () => {
    const { result } = setupHook(() => usePermissions("cases", [PERMISSIONS.ACTIONS.MANAGE]), {
      user: {
        permissions: {
          cases: [PERMISSIONS.ACTIONS.MANAGE]
        }
      }
    });

    expect(result.current).to.eql(true);
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
          canManageCase: [PERMISSIONS.ACTIONS.READ],
          canApprove: [
            PERMISSIONS.ACTIONS.MANAGE,
            PERMISSIONS.ACTIONS.APPROVE_ASSESSMENT,
            PERMISSIONS.ACTIONS.APPROVE_CASE_PLAN,
            PERMISSIONS.ACTIONS.APPROVE_CLOSURE,
            PERMISSIONS.ACTIONS.APPROVE_ACTION_PLAN,
            PERMISSIONS.ACTIONS.APPROVE_GBV_CLOSURE
          ],
          canDelete: [PERMISSIONS.ACTIONS.DELETE]
        }),
      {
        user: {
          permissions: {
            cases: [PERMISSIONS.ACTIONS.APPROVE_ASSESSMENT, PERMISSIONS.ACTIONS.DELETE]
          }
        }
      }
    );

    expect(result.current).to.eql(expected);
  });
});
