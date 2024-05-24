// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../../../../permissions";

import UserConfirmation from "./component";

describe("<UserConfirmation /> - Component", () => {
  const props = {
    close: () => {},
    dialogName: "dialog",
    id: "20",
    pending: false,
    saveMethod: "new",
    setPending: () => {},
    userConfirmationOpen: false,
    userData: {},
    open: true
  };
  const initialState = fromJS({
    records: {
      users: {
        data: [
          {
            id: "1",
            user_name: "Jose"
          },
          {
            id: "2",
            user_name: "Carlos"
          }
        ],
        metadata: { total: 2, per: 20, page: 1 }
      }
    },
    user: {
      permissions: {
        users: [ACTIONS.MANAGE]
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<UserConfirmation {...props} />, initialState);
  });

  it("renders UserConfirmation component", () => {
    expect(screen.getByText("user.messages.new_confirm_non_identity_html")).toBeInTheDocument();
  });
});
