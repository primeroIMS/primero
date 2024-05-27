import { mountedComponent, screen } from "test-utils";

import Jewel from "./component";

describe("<Jewel /> components/jewel", () => {
  it("renders a <Jewel /> component", () => {
    const newProps = {
      icon: <></>,
      isTransparent: false,
      className: "MuiSvgIcon-root",
      value: ["text"]
    };

    mountedComponent(<Jewel {...newProps} />);
    expect(screen.getByTestId("jewel")).toBeInTheDocument();
  });

  it("renders error and alert canvas", () => {
    const errorProps = {
      icon: <></>,
      isTransparent: false,
      value: "Menu 1",
      isForm: true,
      isError: true
    };

    mountedComponent(<Jewel {...errorProps} />);
    expect(screen.getByTestId("error")).toBeInTheDocument();
  });
});
