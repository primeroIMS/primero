// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { mountedComponent, screen, cleanup } from "test-utils";

import CancelDialog from "./component";

describe("<TermsOfUse /> - <CancelDialog />", () => {
  const props = {
    open: false,
    close: () => {},
    logout: () => {},
    i18n: {
      t: key => key
    }
  };

  beforeEach(() => {
    mountedComponent(<CancelDialog {...props} />);
  });

  describe("when open is false", () => {
    it("should not show dialog", () => {
      expect(screen.queryByText("messages.logout_confirmation_title")).not.toBeInTheDocument();
    });
  });

  describe("when open is true", () => {
    beforeEach(() => {
      const newProps = { ...props, open: true };

      cleanup();
      mountedComponent(<CancelDialog {...newProps} />);
    });

    it("should render the dialog title", () => {
      expect(screen.getByText("messages.logout_confirmation_title")).toBeInTheDocument();
      expect(screen.getByText("messages.logout_confirmation_text")).toBeInTheDocument();
    });

    it("should render buttons", () => {
      expect(screen.getByText("cancel")).toBeInTheDocument();
      expect(screen.getByText("navigation.logout")).toBeInTheDocument();
    });
  });
});
