import { setupMountedComponent } from "../../../test";
import ActionButton from "../../action-button";

import Exporter from "./exporter";

describe("<Exporter />", () => {
  describe("when includesGraph is true", () => {
    let component;

    beforeEach(() => {
      ({ component } = setupMountedComponent(Exporter, { includesGraph: true }));
    });

    it("should render 2 <ActionButton /> component", () => {
      expect(component.find(ActionButton)).to.have.lengthOf(2);
    });

    it("should accept valid props for <ActionButton /> component", () => {
      const actionButtonProps = { ...component.find(ActionButton).at(0).props() };

      ["icon", "type", "isTransparent", "rest", "outlined"].forEach(property => {
        expect(actionButtonProps).to.have.property(property);
        delete actionButtonProps[property];
      });
      expect(actionButtonProps).to.be.empty;
    });
  });

  describe("when includesGraph is false", () => {
    let component;

    beforeEach(() => {
      ({ component } = setupMountedComponent(Exporter, { includesGraph: false }));
    });

    it("should render 1 <ActionButton /> component", () => {
      expect(component.find(ActionButton)).to.have.lengthOf(1);
    });

    it("should accept valid props for <ActionButton /> component", () => {
      const actionButtonProps = { ...component.find(ActionButton).props() };

      ["icon", "type", "isTransparent", "rest", "outlined"].forEach(property => {
        expect(actionButtonProps).to.have.property(property);
        delete actionButtonProps[property];
      });
      expect(actionButtonProps).to.be.empty;
    });
  });
});
