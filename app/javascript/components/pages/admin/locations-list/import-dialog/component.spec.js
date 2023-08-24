import { mountedComponent, screen } from "test-utils";

import ImportDialog from "./component";

describe("<ImportDialog />", () => {
  const props = {
    close: () => {},
    i18n: { t: value => value },
    open: true,
    pending: false
  };

  beforeEach(() => {
    mountedComponent(<ImportDialog {...props} />);
  });

  it("should render <ActionDialog />", () => {
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should render <Form /> component", () => {
    expect(document.querySelector("#import-locations-form")).toBeInTheDocument();
  });
});
