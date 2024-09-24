// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../test-utils";

import TermOfUse from "./component";

describe("<TermOfUse />", () => {
  const state = fromJS({
    application: {
      agencies: [
        {
          agency_code: "Other",
          name: {
            en: "Other"
          },
          terms_of_use_enabled: true,
          terms_of_use: "/test/path/file.pdf"
        },
        {
          agency_code: "test",
          name: {
            en: "test"
          },
          terms_of_use_enabled: false
        },
        {
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
  });

  it("should render h2", () => {
    mountedComponent(<TermOfUse />, state);

    expect(screen.getByText(/navigation.support_menu.terms_of_use/i)).toBeInTheDocument();
  });

  it("should render 2 buttons", () => {
    mountedComponent(<TermOfUse />, state);

    expect(screen.getAllByRole("heading")).toHaveLength(1);
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
