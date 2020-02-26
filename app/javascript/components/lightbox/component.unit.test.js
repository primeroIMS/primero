import React from "react";
import { Backdrop } from "@material-ui/core";

import { expect, setupMountedComponent } from "../../test";

import Lightbox from "./component";

describe("<Lightbox />", () => {
  let component;

  const LightBoxButton = () => <div>Button</div>;

  const props = {
    image: "/image.png",
    trigger: <LightBoxButton />
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(Lightbox, props));
  });

  it("should render clickable button to trigger lightbox", () => {
    expect(component.find("button").at(0)).to.contain(LightBoxButton);
  });

  it("should open/close lightbox", () => {
    const button = component.find("button").at(0);

    button.simulate("click");
    expect(component.find(Backdrop).prop("open")).to.be.true;

    button.simulate("click");
    expect(component.find(Backdrop).prop("open")).to.be.false;
  });

  it("should render image in lightbox", () => {
    expect(component.find("img").prop("src")).to.equal("/image.png");
  });

  it("should return false if no image available", () => {
    const { component: noPropsComponent } = setupMountedComponent(Lightbox);

    expect(noPropsComponent.find("button").at(0)).to.contain(LightBoxButton);
    expect(noPropsComponent.find(Backdrop)).to.be.lengthOf(0);
  });
});
