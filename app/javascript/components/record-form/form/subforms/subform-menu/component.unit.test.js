import { fromJS } from "immutable";
import { IconButton, Menu, MenuItem } from "@material-ui/core";

import { ACTIONS } from "../../../../../libs/permissions";
import { setupMountedComponent } from "../../../../../test";

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

  it("renders the subform menu", () => {
    const { component } = setupMountedComponent(SubformMenu, props, {});

    expect(component.find(Menu)).lengthOf(1);
  });

  it("render the ReferAction if service is referrable", () => {
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
          lookups: {
            data: [
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

    const { component } = setupMountedComponent(
      SubformMenu,
      props,
      initialState
    );

    component
      .find(IconButton)
      .find("button")
      .simulate("click");

    expect(component.find(MenuItem)).lengthOf(1);
  });
});
