import { fromJS } from "immutable";

import { mountedComponent, screen, setScreenSizeToMobile } from "../../test-utils";

import MobileToolbar from "./component";

describe("<MobileToolbar />", () => {
  const state = fromJS({ MobileToolbar: { module: "primero" } });
  const props = { openDrawer: () => {} };

  beforeAll(() => {
    setScreenSizeToMobile(false);
  });

  it("should render MobileToolbar component", () => {
    mountedComponent(<MobileToolbar {...props} />, state);
    expect(screen.getByTestId("appBar")).toBeInTheDocument();
  });

  it("should render Logo component", () => {
    mountedComponent(<MobileToolbar {...props} />, state);
    expect(screen.getByTestId("logo-primero")).toBeInTheDocument();
  });

  describe("when is not demo site", () => {
    it("should not render a <div> tag with 'Demo' text", () => {
      mountedComponent(<MobileToolbar {...props} />, state);
      expect(screen.getByText(/sandbox_ui/i)).not.toBeInTheDocument();
    });
  });

  describe("when is demo site", () => {
    const stateWithDemo = fromJS({
      application: {
        primero: {
          sandbox_ui: true
        }
      }
    });

    it("should render a <div> tag with 'Demo' text", () => {
      mountedComponent(<MobileToolbar {...props} />, stateWithDemo);
      expect(screen.getByText(/sandbox_ui/i)).toBeInTheDocument();
    });
  });
});
