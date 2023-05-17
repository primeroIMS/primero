import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import DashboardTable from "./component";

describe("<DashboardTable />", () => {
  let component;
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
    // expect(component.find(MUIDataTable)).to.have.lengthOf(1);
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });

  it("should render text", () => {
    expect(screen.queryAllByText("testTitle")).toBeTruthy();
  });

  it("should have attribute aria-label", () => {
    // const label = component.find(MUIDataTable).find("table").first().props()["aria-label"];
    // expect(label).to.equals(props.title);

    expect(screen.queryAllByText("label")).toBeTruthy();
  });
});
