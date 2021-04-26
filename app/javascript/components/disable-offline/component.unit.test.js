import { fromJS } from "immutable";
import { Tooltip } from "@material-ui/core";

import { setupMountedComponent } from "../../test";

import DisableOffline from "./component";

describe("components/disable-offline - DisableOffline", () => {
  const component = (online, props) =>
    setupMountedComponent(
      () => (
        <DisableOffline>
          <div>element</div>
        </DisableOffline>
      ),
      { text: "offline", ...props },
      fromJS({
        connectivity: {
          online,
          serverOnline: true
        }
      })
    ).component;

  it("renders element in offline state if offline", () => {
    expect(component(false).find(Tooltip)).to.have.lengthOf(1);
  });

  it("renders element in online state if online", () => {
    expect(component(true).find(Tooltip)).to.have.lengthOf(0);
  });

  it("renders element if overrideCondition", () => {
    expect(component(false, { overrideCondition: true }).find(Tooltip)).to.have.lengthOf(1);
  });
});
