import { fromJS } from "immutable";
import { Button } from "@material-ui/core";

import { ACTIONS } from "../../../../../libs/permissions";
import { setupMountedComponent } from "../../../../../test";
import { FormAction, whichFormMode } from "../../../../form";

import ActionButtons from "./action-buttons";

describe("<ActionButtons />", () => {
  const defaultProps = {
    formRef: {},
    setOpenDeleteDialog: () => ({}),
    handleCancel: () => ({})
  };

  context("when isShow mode", () => {
    context("when the user has write permissions on roles", () => {
      const { component } = setupMountedComponent(
        ActionButtons,
        { ...defaultProps, formMode: whichFormMode("show") },
        fromJS({
          user: {
            permissions: {
              roles: [ACTIONS.WRITE]
            }
          }
        })
      );

      it("should render the edit button only", () => {
        const actionButton = component.find(Button);

        expect(actionButton).to.have.lengthOf(1);
        expect(actionButton.text()).to.be.equal("buttons.edit");
      });
    });

    context("when the user doesn't have write permissions on roles", () => {
      const { component } = setupMountedComponent(
        ActionButtons,
        { ...defaultProps, formMode: whichFormMode("show") },
        fromJS({})
      );

      it("should not render the edit button", () => {
        const actionButton = component.find(Button);

        expect(actionButton).to.have.lengthOf(0);
      });
    });
  });

  context("when isEdit mode", () => {
    const { component } = setupMountedComponent(
      ActionButtons,
      { ...defaultProps, formMode: whichFormMode("edit") },
      fromJS({})
    );

    it("should render cancel and save buttons only", () => {
      const actionButtons = component.find(FormAction);

      expect(actionButtons).to.have.lengthOf(2);
      expect(actionButtons.first().props().text).to.be.equal("buttons.cancel");
      expect(actionButtons.last().props().text).to.be.equal("buttons.save");
    });
  });

  context("when isNew mode", () => {
    const { component } = setupMountedComponent(
      ActionButtons,
      { ...defaultProps, formMode: whichFormMode("new") },
      fromJS({})
    );

    it("should render cancel and save buttons", () => {
      const actionButtons = component.find(FormAction);

      expect(actionButtons).to.have.lengthOf(2);
      expect(actionButtons.first().props().text).to.be.equal("buttons.cancel");
      expect(actionButtons.last().props().text).to.be.equal("buttons.save");
    });
  });
});
