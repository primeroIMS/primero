import "test/test.setup";
import React from "react";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import Paper from "@material-ui/core/Paper";
import Menu from "./menu";

describe("<Menu />", () => {
  let component;

  const props = {
    children: <></>,
    innerProps: {
      onMouseDown: () => {},
      onMouseMove: () => {}
    },
    selectProps: {
      id: "Test",
      TextFieldProps: { label: "Test" },
      classes: {
        root: "testStyle"
      }
    }
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(Menu, props));
  });

  it("renders Paper", () => {
    expect(component.find(Paper)).to.have.length(1);
  });
});
