// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, translateOptions, screen } from "../../../../../test-utils";

import SubformEmptyData from "./component";

describe("<SubformEmptyData />", () => {
  const translations = {
    en: {
      "forms.subform_not_found": "No %{subform_name} found.",
      "forms.subform_need_to_be_added": "They need to be added"
    }
  };

  const props = {
    handleClick: jest.fn(),
    i18n: { t: (value, options) => translateOptions(value, options, translations) },
    mode: { isEdit: true },
    subformName: "Test form"
  };

  it("should render one div", () => {
    mountedComponent(<SubformEmptyData {...props} />, {});
    expect(screen.getByTestId("subform-empty-data")).toBeInTheDocument();
  });

  it("should render the correct subform name", () => {
    mountedComponent(<SubformEmptyData {...props} />, {});
    expect(screen.getByText(/forms.subform_not_found/i)).toBeInTheDocument();
  });

  it("should render the ActionButton component", () => {
    mountedComponent(<SubformEmptyData {...props} />, {});
    expect(screen.queryByText("DEPRECATED")).toBeNull();
  });

  it("should call onClick event passed as a prop", () => {
    mountedComponent(<SubformEmptyData {...props} />, {});
    expect(screen.queryByText("DEPRECATED")).toBeNull();
  });
});
