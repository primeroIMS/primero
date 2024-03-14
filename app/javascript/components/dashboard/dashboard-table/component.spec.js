import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import DashboardTable from "./component";

describe("<DashboardTable />", () => {
  const props = {
    columns: [],
    data: [],
    query: [],
    title: "testTitle",
    pathname: "/cases"
  };

  const state = fromJS({
    user: {
      permissions: {
        cases: ["manage"]
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<DashboardTable {...props} />, state);
  });

  it("renders a MUIDataTable />", () => {
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("should render text", () => {
    expect(screen.queryAllByText("testTitle")).toBeTruthy();
  });
});
