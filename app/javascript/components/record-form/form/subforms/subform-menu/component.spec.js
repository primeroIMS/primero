// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { ACTIONS } from "../../../../permissions";
import { mountedComponent, screen } from "../../../../../test-utils";

import SubformMenu from "./component";

describe("<SubformMenu />", () => {
  const props = {
    values: [
      {
        service_type: "service_1",
        service_implementing_agency: "agency_1",
        service_implementing_agency_individual: "user_1",
        service_record_id: "service_id_1",
        service_status_referred: false
      }
    ],
    index: 0
  };

  it("renders nothing if not referrable", () => {
    const state = {
      user: {
        permissions: {
          cases: [ACTIONS.REFERRAL_FROM_SERVICE]
        }
      }
    };

    mountedComponent(<SubformMenu {...props} />, state);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  describe("when the service is referrable", () => {
    const initialState = fromJS({
      application: {
        agencies: [
          {
            id: 1,
            unique_id: "agency_1",
            agency_code: "a1",
            name: { en: "Agency 1" },
            services: ["service_1"]
          }
        ]
      },
      forms: {
        options: {
          lookups: [
            {
              id: 1,
              unique_id: "lookup-service-type",
              values: [
                {
                  id: "service_1",
                  display_text: {
                    en: "Service No. 1"
                  }
                }
              ]
            }
          ]
        }
      },
      records: {
        transitions: {
          referral: {
            users: [
              {
                id: 1,
                user_name: "user_1",
                services: ["service_1"],
                agency: "agency_1"
              }
            ]
          }
        }
      },
      user: {
        permissions: {
          cases: [ACTIONS.REFERRAL_FROM_SERVICE]
        }
      }
    });

    it("render the ReferAction if service is referrable and the user has the REFERRAL_FROM_SERVICE permission", () => {
      mountedComponent(<SubformMenu {...props} />, initialState);

      expect(screen.getAllByRole("button")).toHaveLength(1);
    });

    it("render the ReferAction if service is referrable and the user has the REFERRAL permission", () => {
      mountedComponent(
        <SubformMenu {...props} />,
        initialState.setIn(["user", "permissions", "cases"], fromJS([ACTIONS.REFERRAL]))
      );

      expect(screen.getAllByRole("button")).toHaveLength(1);
    });

    it("does not render the ReferAction if service is referrable and the user has no permission", () => {
      mountedComponent(<SubformMenu {...props} />, initialState.setIn(["user", "permissions", "cases"], fromJS([])));

      expect(screen.queryAllByRole("button")).toHaveLength(0);
    });
  });
});
