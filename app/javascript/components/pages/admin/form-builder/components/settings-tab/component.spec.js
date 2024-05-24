import { mountedFormComponent, screen } from "test-utils";

import SettingsTab from "./component";

describe("<SettingsTab />", () => {
  const props = { index: 1, tab: 1, formContextFields: {}, fieldDialogMode: "new", mode: "isNew" };

  beforeEach(() => {
    mountedFormComponent(<SettingsTab {...props} />);
  });

  it("should render <SettingsTab />", () => {
    expect(screen.getByTestId("settings-tab")).toBeInTheDocument();
  });

  it("should render <FormSection />", () => {
    expect(screen.getAllByText("forms.title")).toHaveLength(2);
  });
});
