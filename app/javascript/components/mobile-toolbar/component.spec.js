import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../test-utils";

import MobileToolbar from "./component";

describe("<MobileToolbar />", () => {
  const state = fromJS({ MobileToolbar: { module: "primero" } });
  const props = { openDrawer: () => {} };

  it("should render Hidden component", () => {
    mountedComponent(<MobileToolbar {...props} />, state);
    expect(screen.getByTestId("appBar")).toBeInTheDocument();
  });
  it("should render AppBar component", () => {
    mountedComponent(<MobileToolbar {...props} />, state);
    expect(screen.getByTestId("appBar")).toBeInTheDocument();
  });

  it("should render Toolbar component", () => {
    mountedComponent(<MobileToolbar {...props} />, state);
    expect(screen.getByTestId("appBar")).toBeInTheDocument();
  });

  it("should render IconButton component", () => {
    mountedComponent(<MobileToolbar {...props} />, state);
    expect(screen.queryAllByText((content, element) => element.tagName.toLowerCase() === "svg")).toHaveLength(2);
  });

  it("should render ModuleLogo component", () => {
    mountedComponent(<MobileToolbar {...props} />, state);
    expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "img")).toBeInTheDocument();
  });

  describe("when is not demo site", () => {
    it("should not render a <div> tag with 'Demo' text", () => {
      mountedComponent(<MobileToolbar {...props} />, state);
      expect(screen.getByText(/online/i)).toBeInTheDocument();
    });
  });

  describe("when is demo site", () => {
    const stateWithDemo = fromJS({
      application: {
        demo: true
      }
    });

    it("should render a <div> tag with 'Demo' text", () => {
      mountedComponent(<MobileToolbar {...props} />, stateWithDemo);
      expect(screen.getByText(/online/i)).toBeInTheDocument();
    });
  });
});
