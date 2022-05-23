import { setupMountedComponent } from "../../../../test";
import ActionDialog from "../../../action-dialog";

import InsightExporter from "./component";

describe("<Insights />/components/<InsightsExporter />", () => {
  const props = {
    close: () => {},
    i18n: { t: value => value },
    open: true,
    pending: false,
    moduleID: "",
    setPending: value => value
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(InsightExporter, props));
  });

  it("renders <ActionDialog />", () => {
    expect(component.find(ActionDialog)).to.have.lengthOf(1);
  });

  it("renders valid props for FormExporter component", () => {
    const clone = { ...component.find(InsightExporter).props() };

    ["close", "i18n", "open", "pending", "moduleID", "setPending"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });

  it("should send all as a subreport param", async () => {
    const result = {
      subreport: "all",
      export_type: "xlsx",
      id: undefined,
      record_type: "incident"
    };

    await component.find("form").simulate("submit");

    expect(component.props().store.getActions()[0].api.params).to.deep.equals(result);
  });
});
