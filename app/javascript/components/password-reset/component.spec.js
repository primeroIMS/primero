import { mountedComponent, screen } from "../../test-utils";

import PasswordReset from "./component";

describe("<PasswordReset />", () => {
  it("should render a <PageHeading /> component", () => {
    mountedComponent(<PasswordReset />);
    expect(screen.getByText(/Set Password/i)).toBeInTheDocument();
  });

  it("should render a <Form /> component", () => {
    mountedComponent(<PasswordReset />);
    expect(screen.getAllByText((content, element) => element.tagName.toLowerCase() === "form")).toHaveLength(1);
  });

  it("should render a <FormAction /> component", () => {
    mountedComponent(<PasswordReset />);
    expect(screen.getByText(/buttons.save/i)).toBeInTheDocument();
  });

  it("should render 2 <TextInput /> components", () => {
    mountedComponent(<PasswordReset />);
    expect(screen.getAllByText((content, element) => element.tagName.toLowerCase() === "input")).toHaveLength(2);
  });
});
