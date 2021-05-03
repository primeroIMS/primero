import { setupMountedComponent } from "../../../../test";
import ActionButton from "../../../action-button";

import ImportData from "./sync-record";

describe("<ImportData />", () => {
  const props = {
    i18n: { t: value => value, localizeDate: value => value },
    syncedAt: "2021-01-05T20:47:36.477Z",
    syncStatus: "synced",
    isEnabledWebhookSyncFor: true
  };

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(ImportData, props));
  });

  it("renders a <ImportData />", () => {
    expect(component.find(ImportData)).to.have.lengthOf(1);
  });

  it("renders a <ActionButton />", () => {
    expect(component.find(ActionButton)).to.have.lengthOf(1);
  });
});
