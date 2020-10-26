import { fromJS } from "immutable";

import { HookWrapper, setupMountedComponent } from "../../test/utils";

import * as PERMISSIONS from "./constants";
import usePermissions from "./use-permissions";

describe("Verifying config constant", () => {
  it("handles single resource permission check", () => {
    const { component } = setupMountedComponent(
      HookWrapper,
      {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        hook: () => usePermissions("cases", [PERMISSIONS.ACTIONS.MANAGE])
      },
      fromJS({
        user: {
          permissions: {
            cases: [PERMISSIONS.ACTIONS.MANAGE]
          }
        }
      })
    );

    expect(component.find("div").prop("hook")).to.eql(true);
  });

  it("handles multiple resources permission checks", () => {
    const expected = {
      canApprove: true,
      canDelete: true,
      canManageCase: false,
      permittedAbilities: fromJS(["approve_assessment", "delete"])
    };

    const { component } = setupMountedComponent(
      HookWrapper,
      {
        hook: () =>
          // eslint-disable-next-line react-hooks/rules-of-hooks
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
          })
      },
      fromJS({
        user: {
          permissions: {
            cases: [PERMISSIONS.ACTIONS.APPROVE_ASSESSMENT, PERMISSIONS.ACTIONS.DELETE]
          }
        }
      })
    );

    expect(component.find("div").prop("hook")).to.eql(expected);
  });
});
