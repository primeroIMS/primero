import React from "react";
import { Tooltip as MuiTooltip } from "@material-ui/core";

import { createSimpleMount } from "../../test";

import Tooltip from "./component";

describe("components/tooltip", () => {
  it("renders tooltip", () => {
    const component = createSimpleMount(
      <Tooltip title="wrapper content">
        <div>wrapped children</div>
      </Tooltip>
    );

    expect(component.find(MuiTooltip).prop("title")).to.equal(
      "wrapper content"
    );
    expect(component.contains("wrapped children")).to.be.true;
  });

  it("does not render tooltip without title", () => {
    const component = createSimpleMount(
      <Tooltip title="">
        <div>wrapped children</div>
      </Tooltip>
    );

    expect(component.find(MuiTooltip)).to.have.lengthOf(0);
    expect(component.contains("wrapped children")).to.be.true;
  });
});
