import { mountedComponent, screen } from "../../../../test-utils";

import NotAuthorized from "./component";

describe("<NotAuthorized />", () => {
  it("renders h1 tag", () => {
    mountedComponent(<NotAuthorized />, {});
    expect(screen.getByText(/error_page.not_authorized.code/i)).toBeInTheDocument();
  });

  it("renders h6 tag", () => {
    mountedComponent(<NotAuthorized />, {});
    expect(screen.getByText(/error_page.not_authorized.title/i)).toBeInTheDocument();
  });

  it("renders p tag", () => {
    mountedComponent(<NotAuthorized />, {});
    expect(screen.getByText(/error_page.not_authorized.server_error/i)).toBeInTheDocument();
  });

  it("renders forgot a tag", () => {
    mountedComponent(<NotAuthorized />, {});
    expect(screen.getByText(/navigation.home/i)).toBeInTheDocument();
  });
});
