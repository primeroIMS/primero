import { fromJS } from "immutable";
import { FormContext } from "react-hook-form";

import { setupMountedComponent, expect } from "../../../../../../test";
import { ACTIONS } from "../../../../../../libs/permissions";
import Actions from "../../../../../index-filters/components/actions";

import AuditLogsFilter from "./container";

describe("<AuditLogsFilter />", () => {
  let component;
  const state = fromJS({
    user: {
      user_name: "primero",
      permissions: {
        audit_logs: [ACTIONS.MANAGE]
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(AuditLogsFilter, {}, state, [
      "/admin/audit_logs"
    ]));
  });

  it("renders <FormContext /> component", () => {
    expect(component.find(FormContext)).to.have.lengthOf(1);
  });

  it("renders <Actions /> component", () => {
    expect(component.find(Actions)).to.have.lengthOf(1);
  });
});
