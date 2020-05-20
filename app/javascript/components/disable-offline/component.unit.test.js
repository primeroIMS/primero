import { fromJS } from "immutable";
import React from "react";
import { Tooltip } from "@material-ui/core";

import { setupMountedComponent } from "../../test";

import DisableOffline from "./component";

describe("components/disable-offline - DisableOffline", () => {
  const component = online =>
    setupMountedComponent(
      () => (
        <DisableOffline>
          <div>element</div>
        </DisableOffline>
      ),
      { text: "offline" },
      fromJS({
        application: {
          online
        }
      })
    ).component;

  it("renders element in offline state if offline", () => {
    expect(component(false).find(Tooltip)).to.have.lengthOf(1);
  });

  it("renders element in online state if online", () => {
    expect(component(true).find(Tooltip)).to.have.lengthOf(0);
  });
});
