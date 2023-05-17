import { mountedComponent, screen } from "test-utils";

import FlagBoxItem from "./component";

describe("<FlagBoxItem />", () => {
  let component;
  const props = {
    date: "2020-12-10",
    reason: "Reason 1",
    recordId: "41a3e69b-991a-406e-b0ee-9123cb60c983",
    title: "User 1",
    user: "primero_test"
  };

  beforeEach(() => {
    mountedComponent(<FlagBoxItem {...props} />);
  });

  it("should render a h4 tag", () => {
    expect(screen.getByRole("heading")).toHaveTextContent("User 1");
  });

  it("should render a span tag", () => {
    expect(screen.getByText("2020-12-10")).toBeInTheDocument();
  });

  it("should render a p tag", () => {
    expect(screen.getByText("Reason 1")).toBeInTheDocument();
  });

  it("should render a span tag", () => {
    expect(screen.getByText("primero_test")).toBeInTheDocument();
  });
});
