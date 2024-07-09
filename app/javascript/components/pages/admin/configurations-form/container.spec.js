// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { ACTIONS } from "../../../permissions";
import { MODES } from "../../../../config";
import { mountedComponent, screen } from "../../../../test-utils";

import ConfigurationsForm from "./container";

describe("<ConfigurationsForm />", () => {
  const initialState = fromJS({
    records: {
      admin: {
        configurations: {
          selectedConfiguration: {
            id: "ac3d041c-1592-4f99-8191-b38fbe448735",
            name: "SWIMS - 20200903",
            description: "September 2020 baseline",
            version: "20200826.113513.25bf89a",
            created_on: "2020-08-26T15:35:13.720Z",
            created_by: "primero_swims_admin",
            applied_on: null,
            applied_by: null,
            can_apply: true
          }
        }
      }
    },
    user: {
      permissions: {
        configurations: [ACTIONS.MANAGE]
      }
    }
  });

  describe("when the configuration can not be applied", () => {
    const props = {
      mode: MODES.show
    };

    mountedComponent(
      <ConfigurationsForm {...props} />,
      initialState.setIn(["records", "admin", "configurations", "selectedConfiguration", "can_apply"], false)
    );

    it("should render the apply button as disabled", () => {
      expect(screen.getByText("buttons.apply").closest("button")).toBeDisabled();
    });
  });
});
