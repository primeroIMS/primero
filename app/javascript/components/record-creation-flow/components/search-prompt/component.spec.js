// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import { RECORD_PATH } from "../../../../config";

import SearchPrompt from "./component";

describe("<SearchPrompt />", () => {
  const props = {
    i18n: { t: value => value },
    onCloseDrawer: () => {},
    recordType: RECORD_PATH.cases,
    setOpenConsentPrompt: () => {},
    setSearchValue: () => {},
    goToNewCase: () => {},
    dataProtectionFields: [],
    onSearchCases: () => {}
  };

  const initialState = fromJS({});

  beforeEach(() => {
    mountedComponent(<SearchPrompt {...props} />, initialState);
  });

  it("should render a <FormHelperText /> component", () => {
    expect(screen.getByText("case.search_helper_text")).toBeInTheDocument();
  });

  it("should render a <InputLabel /> component", () => {
    expect(screen.getByPlaceholderText("case.search_existing")).toBeInTheDocument();
  });

  it("should render a form component", () => {
    expect(document.querySelector("#record-creation-form")).toBeInTheDocument();
  });

  it("should render a <ActionButton /> component", () => {
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
