import { mountedComponent, screen } from "test-utils";

import ChangeLogItem from ".";

describe("ChangeLogItems - Component", () => {
  const title = "Changed Nationality from Canada to Australia";
  const user = "primero";
  const props = {
    item: {
      title,
      user,
      date: "2020-08-11T10:27:33Z",
      change: { from: "Canada", to: "Australia", name: "Field" }
    }
  };

  beforeEach(() => {
    mountedComponent(<ChangeLogItem {...props} />);
  });
  it("renders ChangeLogItem", () => {
    const element = screen.getByText("Changed Nationality from Canada to Australia");

    expect(element).toBeInTheDocument();
  });

  it("renders the change", () => {
    const element = screen.getByText('change_logs.from "Canada" change_logs.to "Australia"');

    expect(element).toBeInTheDocument();
  });
});
