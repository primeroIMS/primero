// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { mountedComponent, screen, cleanup } from "test-utils";

import TermsOfUse from "./component";

describe("<TermsOfUse />", () => {
  const userState = {
    id: 1,
    user_name: "primero",
    agencyId: 1,
    agencyTermsOfUseEnabled: true,
    agencyTermsOfUseChanged: false
  };
  const state = {
    user: userState,
    application: {
      agencies: [
        {
          id: 1,
          name: "Agency 1",
          terms_of_use_uploaded_at: "2023-10-01T10:00:00Z"
        }
      ],
      termsOfUseAcknowledge: {
        en: "Please acknowledge the terms of use"
      }
    }
  };

  beforeEach(() => {
    mountedComponent(<TermsOfUse />, state);
  });

  it("should render the TermsOfUse component", () => {
    expect(screen.getByTestId("terms-of-use-container")).toBeInTheDocument();
    expect(screen.getByText(state.application.termsOfUseAcknowledge.en)).toBeInTheDocument();
  });

  it("should render the Actions component", () => {
    expect(screen.getByText("buttons.cancel")).toBeInTheDocument();
    expect(screen.getByText("terms_of_use.view_button")).toBeInTheDocument();
    expect(screen.getByText("buttons.accept")).toBeInTheDocument();
  });

  describe("when agencyTermsOfUseEnabled is false", () => {
    beforeEach(() => {
      cleanup();
      mountedComponent(<TermsOfUse />, { ...state, user: { agencyTermsOfUseEnabled: false } });
    });

    it("should not render the component", () => {
      expect(screen.queryByText(state.application.termsOfUseAcknowledge.en)).not.toBeInTheDocument();
    });
  });

  describe("when terms have changed", () => {
    beforeEach(() => {
      cleanup();
      mountedComponent(<TermsOfUse />, { ...state, user: { ...userState, agencyTermsOfUseChanged: true } });
    });

    it("should render the changed message", () => {
      expect(screen.getByText("terms_of_use.changed_message")).toBeInTheDocument();
    });
  });
});
