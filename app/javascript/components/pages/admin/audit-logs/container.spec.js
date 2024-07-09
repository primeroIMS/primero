import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import { ACTIONS } from "../../../permissions";

import AuditLogs from "./container";

describe("<AuditLogs />", () => {
  const state = fromJS({
    user: {
      permissions: {
        audit_logs: [ACTIONS.MANAGE]
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<AuditLogs />, state, ["/admin/audit_logs"]);
  });
  it("renders <PageHeading /> component", () => {
    expect(screen.getByTestId("page-heading")).toBeInTheDocument();
  });

  it("renders <IndexTable /> component", () => {
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("renders <FiltersForm /> component", () => {
    expect(screen.getByTestId("form-filter")).toBeInTheDocument();
  });
});
