import { setupMountedComponent } from "../../../test";
import ActionButton from "../../action-button";

import TableExporter from "./table-exporter";

describe("<TableExporter />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(TableExporter));
  });

  it("should render <ActionButton /> component", () => {
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
