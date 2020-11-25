import { fromJS } from "immutable";
import CheckIcon from "@material-ui/icons/Check";
import SignalWifiOffIcon from "@material-ui/icons/SignalWifiOff";

import { setupMountedComponent } from "../../test";

import NetworkIndicator from "./component";

describe("<NetworkIndicator />", () => {
  it("should render an online indicator when the application is online", () => {
    const { component } = setupMountedComponent(
      NetworkIndicator,
      {},
      fromJS({ connectivity: { online: true, serverOnline: true } })
    );

    expect(component.find(CheckIcon)).to.have.lengthOf(1);
    expect(component.find(SignalWifiOffIcon)).to.have.lengthOf(0);
    expect(component.find("span").text()).to.equal("online");
  });

  it("should render an offline indicator when the application is offline", () => {
    const { component } = setupMountedComponent(
      NetworkIndicator,
      {},
      fromJS({ connectivity: { online: false, serverOnline: true } })
    );

    expect(component.find(CheckIcon)).to.have.lengthOf(0);
    expect(component.find(SignalWifiOffIcon)).to.have.lengthOf(1);
    expect(component.find("span").text()).to.equal("offline");
  });
});
