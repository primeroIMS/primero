import { fromJS } from "immutable";
import Alert from "@material-ui/lab/Alert";

import { setupMountedComponent } from "../../../../test";

import OfflineAlert from "./component";

describe("components/disable-offline/components/offline-alert/component", () => {
  const component = online =>
    setupMountedComponent(
      OfflineAlert,
      { text: "offline" },
      fromJS({
        application: {
          online
        }
      })
    ).component;

  it("renders alert if offline", () => {
    expect(component(false).find(Alert)).to.have.lengthOf(1);
  });

  it("does not render alert if online", () => {
    expect(component(true).find(Alert)).to.have.lengthOf(0);
  });
});
