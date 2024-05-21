// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";

import SubformLink from "./component";

describe("<SubformLink />", () => {
  const props = {
    href: "random/href",
    label: "Random SubformLink Label",
    text: "href text",
    disabled: false
  };

  describe("When is enabled", () => {
    it("When is enabled renders the SubformLink", async () => {
      mountedComponent(<SubformLink {...props} />);

      const subformLinkLabel = await screen.findByText("Random SubformLink Label");
      const subformLinkText = await screen.findByText("href text");

      expect(subformLinkLabel).toBeInTheDocument();
      expect(subformLinkText).toBeInTheDocument();
    });
  });

  describe("When is disabled", () => {
    it("renders the SubformLink", async () => {
      mountedComponent(<SubformLink {...{ ...props, disabled: true }} />);

      expect(screen.getByTitle("cases.access_denied")).toBeInTheDocument();
    });
  });
});
