import { fromJS } from "immutable";

import { setupMountedComponent, expect } from "../../../../../test";
import { FormAction, whichFormMode } from "../../../../form";

import ActionButtons from "./action-buttons";

describe("<ActionButtons />", () => {
  context("when isShow mode", () => {
    const { component } = setupMountedComponent(
      ActionButtons,
      {
        formMode: whichFormMode("show"),
        formRef: {},
        handleCancel: () => {},
        handleEdit: () => {}
      },
      fromJS({})
    );

    it("should render the edit button only", () => {
      const actionButton = component.find(FormAction);

      expect(actionButton).to.have.lengthOf(1);
      expect(actionButton.props().text).to.be.equal("buttons.edit");
    });
  });

  context("when isEdit mode", () => {
    const { component } = setupMountedComponent(
      ActionButtons,
      {
        formMode: whichFormMode("edit"),
        formRef: {},
        handleCancel: () => {},
        handleEdit: () => {}
      },
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
      {
        formMode: whichFormMode("new"),
        formRef: {},
        handleCancel: () => {},
        handleEdit: () => {}
      },
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
