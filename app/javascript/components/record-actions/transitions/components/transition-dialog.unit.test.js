import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from "@material-ui/core";
import { Map } from "immutable";

import { setupMountedComponent } from "../../../../test";
import ActionDialog from "../../../action-dialog";

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
    recordType: "cases",
    onClose: () => {},
    successHandler: () => {}
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
      expect(component.find(DialogTitle).text()).to.equals(
        "transition.type.referral forms.record_types.case 1234abc"
      );
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
      expect(component.find(DialogTitle).text()).to.equals(
        "transition.type.reassign forms.record_types.case 1234abc"
      );
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
      expect(component.find(DialogTitle).text()).to.equals(
        "transition.type.transfer forms.record_types.case 1234abc"
      );
    });
  });

  describe("when transitionType is 'reassign' for bulk operations", () => {
    const transitionType = "reassign";
    const propsForBulk = {
      ...props,
      record: undefined,
      selectedIds: [12345, 67890]
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(TransitionDialog, {
        ...propsForBulk,
        transitionType
      }));
    });

    it("should render 'Assign Cases' as title", () => {
      expect(component.find(DialogTitle).text()).to.equals(
        "transition.type.reassign cases.label "
      );
    });
  });

  describe("when TransitionDialog is rendered", () => {
    const propsRendered = {
      children: <p>Hello world</p>,
      confirmButtonLabel: "Confirm Button",
      enabledSuccessButton: false,
      omitCloseAfterSuccess: false,
      onClose: () => {},
      open: true,
      pending: false,
      record: undefined,
      recordType: "cases",
      selectedIds: [],
      successHandler: () => {},
      transitionType: "assign"
    };

    beforeEach(() => {
      ({ component } = setupMountedComponent(
        TransitionDialog,
        propsRendered,
        {}
      ));
    });

    it("should accept valid props", () => {
      const transitionDialogProps = {
        ...component.find(TransitionDialog).props()
      };

      expect(component.find(TransitionDialog)).to.have.lengthOf(1);
      [
        "children",
        "confirmButtonLabel",
        "enabledSuccessButton",
        "omitCloseAfterSuccess",
        "onClose",
        "open",
        "pending",
        "record",
        "recordType",
        "selectedIds",
        "successHandler",
        "transitionType"
      ].forEach(property => {
        expect(transitionDialogProps).to.have.property(property);
        delete transitionDialogProps[property];
      });
      expect(transitionDialogProps).to.be.empty;
    });

    it("renders valid props for ActionDialog components", () => {
      const actionDialogProps = { ...component.find(ActionDialog).props() };

      expect(component.find(ActionDialog)).to.have.lengthOf(1);
      [
        "maxWidth",
        "onClose",
        "confirmButtonLabel",
        "omitCloseAfterSuccess",
        "open",
        "pending",
        "successHandler",
        "dialogTitle",
        "cancelHandler",
        "enabledSuccessButton",
        "dialogSubHeader",
        "children"
      ].forEach(property => {
        expect(actionDialogProps).to.have.property(property);
        delete actionDialogProps[property];
      });
      expect(actionDialogProps).to.be.empty;
    });
  });
});
