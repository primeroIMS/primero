import React from "react";
import { CircularProgress } from "@material-ui/core";

import { expect, setupMountedComponent } from "../../test";
import { ListIcon } from "../list-icon";

import LoadingIndicator from "./component";

describe("<LoadingIndicator />", () => {
  let component;
  const props = {
    overlay: true,
    hasData: true,
    type: "cases",
    children: <h1>This is a test</h1>,
    loading: false,
    errors: false
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(LoadingIndicator, props, {}));
  });

  it("should render LoadingIndicator", () => {
    expect(component.find(LoadingIndicator)).to.have.lengthOf(1);
  });

  it("should no render CircularProgress when has data", () => {
    expect(component.find(CircularProgress)).to.have.lengthOf(0);
  });

  it("should render Children when has data", () => {
    expect(component.find("h1")).to.have.lengthOf(1);
  });

  describe("When data still loading", () => {
    let component;

    const propsDataLoading = {
      ...props,
      hasData: false,
      loading: true
    };

    before(() => {
      ({ component } = setupMountedComponent(
        LoadingIndicator,
        propsDataLoading,
        {}
      ));
    });

    it("renders LoadingIndicator component", () => {
      expect(component.find(LoadingIndicator)).to.have.lengthOf(1);
    });

    it("renders CircularProgress", () => {
      expect(component.find(CircularProgress)).to.have.lengthOf(1);
    });

    it("doesn't render children", () => {
      expect(component.find("h1")).to.be.empty;
    });
  });

  describe("When doesn't has data", () => {
    let component;

    const propsDataLoading = {
      ...props,
      hasData: false,
      loading: false
    };

    before(() => {
      ({ component } = setupMountedComponent(
        LoadingIndicator,
        propsDataLoading,
        {}
      ));
    });

    it("renders LoadingIndicator component", () => {
      expect(component.find(LoadingIndicator)).to.have.lengthOf(1);
    });

    it("renders CircularProgress", () => {
      expect(component.find(ListIcon)).to.have.lengthOf(1);
    });

    it("doesn't render children", () => {
      expect(component.find("h1")).to.be.empty;
    });

    it("render a message no data found", () => {
      expect(component.find("h5").text()).to.be.equal("errors.not_found");
      expect(component.find("h5")).to.have.lengthOf(1);
    });
  });
});
