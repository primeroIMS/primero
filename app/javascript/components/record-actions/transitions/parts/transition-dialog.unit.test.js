import React from "react";
import { expect } from "chai";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from "@material-ui/core";
import { Map } from "immutable";

import { setupMountedComponent } from "../../../../test";

import TransitionDialog from "./transition-dialog";

describe("<TransitionDialog />", () => {
  let component;
  const record = Map({ case_id_display: "1234abc" });
  const props = {
    open: true,
    transitionType: "referral",
    record,
    children: <></>,
    handleClose: () => {},
    recordType: "cases"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(TransitionDialog, props));
  });

  it("renders Dialog", () => {
    expect(component.find(Dialog)).to.have.length(1);
  });

  it("renders DialogTitle", () => {
    expect(component.find(DialogTitle)).to.have.length(1);
  });

  it("renders DialogContent", () => {
    expect(component.find(DialogContent)).to.have.length(1);
  });

  it("renders IconButton", () => {
    expect(component.find(IconButton)).to.have.length(1);
  });

  describe("when transitionType is 'referral'", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(TransitionDialog, {
        ...props,
        transitionType: "referral"
      }));
    });

    it("should render 'Referral Case No.' as title", () => {
      expect(
        component
          .find("span")
          .first()
          .text()
      ).to.equals("Referral Case 1234abc");
    });
  });

  describe("when transitionType is 'reassign'", () => {
    const transitionType = "reassign";

    beforeEach(() => {
      ({ component } = setupMountedComponent(TransitionDialog, {
        ...props,
        transitionType
      }));
    });

    it("should render 'Assign Case No.' as title", () => {
      expect(
        component
          .find("span")
          .first()
          .text()
      ).to.equals("Assign Case 1234abc");
    });
  });

  describe("when transitionType is 'Transfer'", () => {
    const transitionType = "transfer";

    beforeEach(() => {
      ({ component } = setupMountedComponent(TransitionDialog, {
        ...props,
        transitionType
      }));
    });

    it("should render 'Transfer Case No.' as title", () => {
      expect(
        component
          .find("span")
          .first()
          .text()
      ).to.equals("Transfer Case 1234abc");
    });
  });
});
