import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../test";
import { PageHeading } from "../../../page";
import { ACTIONS } from "../../../../libs/permissions";
import IndexTable from "../../../index-table";
import { Filters } from "../components";

import AuditLogs from "./container";

describe("<AuditLogs />", () => {
  let component;
  const state = fromJS({
    user: {
      permissions: {
        audit_logs: [ACTIONS.MANAGE]
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(AuditLogs, {}, state, [
      "/admin/audit_logs"
    ]));
  });

  it("renders <PageHeading /> component", () => {
    expect(component.find(PageHeading)).to.have.lengthOf(1);
  });

  it("renders <IndexTable /> component", () => {
    expect(component.find(IndexTable)).to.have.lengthOf(1);
  });

  it("renders <Filters /> component", () => {
    expect(component.find(Filters)).to.have.lengthOf(1);
  });
});
