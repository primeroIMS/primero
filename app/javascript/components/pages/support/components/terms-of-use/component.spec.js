// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "../../../../../test-utils";

import TermOfUse from "./component";

describe("<TermOfUse />", () => {
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
          agency_code: "Other",
          name: {
            en: "Other"
          },
          terms_of_use_enabled: true,
          terms_of_use: "/test/path/file.pdf"
        },
        {
          id: 2,
          agency_code: "test",
          name: {
            en: "test"
          },
          terms_of_use_enabled: false
        },
        {
          id: 3,
          agency_code: "new",
          name: {
            en: "new"
          },
          pdf_logo_option: false,
          terms_of_use_enabled: true,
          terms_of_use: "/test/path/file2.pdf"
        }
      ]
    }
  };

  it("should render title", () => {
    mountedComponent(<TermOfUse />, state);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("navigation.support_menu.terms_of_use");
  });

  it("should render sub header", () => {
    mountedComponent(<TermOfUse />, state);
    expect(screen.getByText(/agency.label Other/i)).toBeInTheDocument();
    expect(screen.getByText("terms_of_use.date_upload_updated")).toBeInTheDocument();
  });

  it("should render view button", () => {
    mountedComponent(<TermOfUse />, state);
    expect(screen.getByText("terms_of_use.view_button")).toBeInTheDocument();
  });

  it("should show empty state when agency has no Terms of Use", () => {
    const noTermsState = {
      ...state,
      application: {
        agencies: [
          {
            id: 1,
            agency_code: "Other",
            name: {
              en: "Other"
            },
            terms_of_use_enabled: false
          }
        ]
      }
    };

    mountedComponent(<TermOfUse />, noTermsState);
    expect(screen.getByText("terms_of_use.empty_state")).toBeInTheDocument();
    expect(screen.queryByText("terms_of_use.view_button")).not.toBeInTheDocument();
  });
});
