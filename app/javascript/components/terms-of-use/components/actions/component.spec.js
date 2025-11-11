// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { mountedComponent, screen, cleanup } from "test-utils";

import TermsOfUseActions from "./component";

describe("<TermsOfUse /> - <Actions />", () => {
  const props = {
    css: { actions: "actions-class" },
    handleAccept: () => {},
    handleCancel: () => {},
    handleViewTerms: () => {},
    hasViewedTerms: false,
    updatingTermsOfUse: false
  };

  beforeEach(() => {
    mountedComponent(<TermsOfUseActions {...props} />);
  });

  it("should render actions container", () => {
    expect(screen.getByTestId("terms-of-use-actions")).toBeInTheDocument();
  });

  it("should render cancel button", () => {
    expect(screen.getByText("buttons.cancel")).toBeInTheDocument();
  });

  it("should render view terms button", () => {
    expect(screen.getByText("terms_of_use.view_button")).toBeInTheDocument();
  });

  it("should render accept button", () => {
    expect(screen.getByText("buttons.accept")).toBeInTheDocument();
  });

  describe("when hasViewedTerms is false", () => {
    it("should disable accept button", () => {
      expect(screen.getByText("buttons.accept")).toBeDisabled();
    });
  });

  describe("when hasViewedTerms is true", () => {
    beforeEach(() => {
      const newProps = { ...props, hasViewedTerms: true };

      cleanup();
      mountedComponent(<TermsOfUseActions {...newProps} />);
    });

    it("should enable accept button", () => {
      expect(screen.getByText("buttons.accept")).toBeEnabled();
    });
  });

  describe("when updatingTermsOfUse is true", () => {
    beforeEach(() => {
      const newProps = { ...props, hasViewedTerms: true, updatingTermsOfUse: true };

      cleanup();
      mountedComponent(<TermsOfUseActions {...newProps} />);
    });

    it("should disable accept button", () => {
      expect(screen.getByText("buttons.accept")).toBeDisabled();
    });
  });
});
