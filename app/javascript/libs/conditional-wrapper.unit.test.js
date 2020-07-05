import React from "react";
import { Tooltip } from "@material-ui/core";

import { createSimpleMount } from "../test";

import { ConditionalWrapper } from "./conditional-wrapper";

describe("libs/conditional-wrapper", () => {
  const wrapper = ({ children, text }) => (
    <div>
      {text}
      {children}
    </div>
  );

  it("wraps component with props if condition true", () => {
    const component = createSimpleMount(
      <ConditionalWrapper condition wrapper={wrapper} text="wrapper content">
        <div>wrapped children</div>
      </ConditionalWrapper>
    );

    expect(component.contains("wrapper content")).to.be.true;
    expect(component.contains("wrapped children")).to.be.true;
  });

  it("does not wrap component if condition false", () => {
    const component = createSimpleMount(
      <ConditionalWrapper
        condition={false}
        wrapper={wrapper}
        text="wrapper content"
      >
        <div>wrapped children</div>
      </ConditionalWrapper>
    );

    expect(component.contains("wrapper content")).to.be.false;
    expect(component.contains("wrapped children")).to.be.true;
  });

  it("renders react components", () => {
    const component = createSimpleMount(
      <ConditionalWrapper condition wrapper={Tooltip} title="wrapper content">
        <div>wrapped children</div>
      </ConditionalWrapper>
    );

    expect(component.find(Tooltip).prop("title")).to.equal("wrapper content");
    expect(component.contains("wrapped children")).to.be.true;
  });
});
