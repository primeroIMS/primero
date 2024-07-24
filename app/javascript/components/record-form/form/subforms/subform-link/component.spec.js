// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen, waitFor } from "test-utils";
import { fireEvent } from "@testing-library/react";

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
      fireEvent.mouseOver(screen.getByText("href text"));
      await waitFor(() => expect(screen.getByText("cases.access_denied")).toBeInTheDocument());
    });
  });
});
