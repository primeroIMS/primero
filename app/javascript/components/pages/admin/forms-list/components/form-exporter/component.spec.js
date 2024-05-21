import { mountedComponent, screen } from "test-utils";

import FormExporter from "./component";

describe("<FormsList />/components/<FormExporter />", () => {
  const props = {
    close: () => {},
    filters: {},
    i18n: { t: value => value },
    open: true,
    pending: false
  };

  beforeEach(() => {
    mountedComponent(<FormExporter {...props} />);
  });

  it("renders <ActionDialog />", () => {
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
