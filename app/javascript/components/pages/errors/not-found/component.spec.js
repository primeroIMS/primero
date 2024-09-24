import { mountedComponent, screen } from "../../../../test-utils";

import NotFound from "./component";

describe("<NotFound />", () => {
  it("renders h1 tag", () => {
    mountedComponent(<NotFound />, {});
    expect(screen.getByText(/error_page.not_found.code/i)).toBeInTheDocument();
  });

  it("renders h6 tag", () => {
    mountedComponent(<NotFound />, {});
    expect(screen.getByText(/error_page.not_found.something_went_wrong/i)).toBeInTheDocument();
  });

  it("renders p tag", () => {
    mountedComponent(<NotFound />, {});
    expect(screen.getByText(/error_page.not_found.contact_admin/i)).toBeInTheDocument();
  });

  it("renders forgot a tag", () => {
    mountedComponent(<NotFound />, {});
    expect(screen.getByText(/navigation.home/i)).toBeInTheDocument();
  });
});
