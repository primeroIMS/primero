// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../../test-utils";

import FormTranslationsDialog from "./component";

describe("<FormTranslationsDialog />", () => {
  const props = {
    mode: "edit",
    getValues: value => value,
    reset: value => value,
    onClose: () => {},
    onSuccess: () => {}
  };

  const initialState = fromJS({ ui: { dialogs: { dialog: "FormTranslationsDialog", open: true } } });

  it("should render the dialog", () => {
    mountedComponent(<FormTranslationsDialog {...props} />, initialState);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
