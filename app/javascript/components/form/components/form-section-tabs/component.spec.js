import { mountedComponent, screen } from "test-utils";

import FormSectionTabs from "./component";

describe("<FormSectionTabs />", () => {
  const props = {
    tabs: [
      { name: "tab 1", disabled: true, fields: [] },
      { name: "tab2", disabled: false, fields: [] }
    ],
    handleTabChange: () => {}
  };

  beforeEach(() => {
    mountedComponent(<FormSectionTabs {...props} />);
  });

  it("should render the FormSectionTabs component", () => {
    expect(screen.getByText("tab 1")).toBeInTheDocument();
  });
});
