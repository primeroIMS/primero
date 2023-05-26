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
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "svg")).toBeInTheDocument();
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "circle")).toBeInTheDocument();
  });

  it("renders error and alert canvas", () => {
    const newProps = {
      icon: <></>,
      isTransparent: false,
      className: "MuiSvgIcon-root",
      value: ["text"]
    };

    mountedComponent(<Jewel {...newProps} />);
    expect(screen.getByText("text")).toBeInTheDocument();
  });
});
