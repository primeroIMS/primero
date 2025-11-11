// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";

import TermsOfUsePreview from "./component";

describe("<TermsOfUse /> - <TermsOfUsePreview />", () => {
  const props = {
    mobileDisplay: true,
    onClose: () => {},
    open: true,
    termsOfUseUrl: "example.com/terms-of-use.pdf"
  };

  beforeEach(() => {
    mountedComponent(<TermsOfUsePreview {...props} />);
  });

  it("should render a title", () => {
    expect(screen.getByText("TermsofUse.pdf")).toBeInTheDocument();
  });

  it("should render content container", () => {
    expect(screen.getByTestId("content-container")).toBeInTheDocument();
  });

  it("should render button", () => {
    expect(screen.getByTestId("CloseIcon")).toBeInTheDocument();
  });
});
