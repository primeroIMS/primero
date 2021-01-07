import { setupMountedComponent } from "../../../../../../test";
import ActionDialog from "../../../../../action-dialog";

import FormExporter from "./component";

describe("<FormsList />/components/<FormExporter />", () => {
  const props = {
    close: () => {},
    filters: {},
    i18n: { t: value => value },
    open: true,
    pending: false
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(FormExporter, props));
  });

  it("renders <ActionDialog />", () => {
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("renders valid props for FormExporter component", () => {
    const clone = { ...component.find(FormExporter).props() };

    ["close", "filters", "i18n", "open", "pending"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });
});
