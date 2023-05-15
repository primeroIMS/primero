import { mountedComponent, screen } from "test-utils";
import DisplayData from "./component";
describe("<DisplayData />", () => {
  const props = {
    label: "Test",
    value: "Test Value"
  };

  it("should render label and value props", () => {
    mountedComponent(<DisplayData {...props} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Test Value")).toBeInTheDocument();
  });

  it("should render label prop and default value if any value is passed as a prop", () => {
    const newProps = {
      label: "Test"
    };
    mountedComponent(<DisplayData {...newProps} />);
    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("--")).toBeInTheDocument();
  });
});





