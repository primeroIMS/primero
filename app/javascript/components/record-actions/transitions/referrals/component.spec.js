// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { OPTION_TYPES } from "../../../form";
import { mountedComponent, screen } from "../../../../test-utils";

import Referrals from "./component";

describe("<RecordActions />/transitions/<Referrals />", () => {
  const initialState = fromJS({
    forms: {
      options: {
        lookups: [
          {
            id: 1,
            unique_id: OPTION_TYPES.SERVICE_TYPE,
            name: { en: "Services" },
            values: [
              { id: "service_1", display_text: { en: "Service 1" } },
              { id: "service_2", display_text: { en: "Service 2" } }
            ]
          }
        ],
        locations: [
          { code: "location_1", name: { en: "Location 1" }, admin_level: 1 },
          { code: "location_2", name: { en: "Location 2" }, admin_level: 1 },
          { code: "location_3", name: { en: "Location 3" }, admin_level: 1 }
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
              code: "user_1",
              location: "location_1",
              agency: "agency_1",
              services: ["service_1"]
            },
            {
              id: 2,
              user_name: "user_2",
              code: "user_2",
              location: "location_2",
              agency: "agency_2",
              services: ["service_2"]
            },
            {
              id: 3,
              user_name: "user_3",
              code: "user_3",
              location: "location_1",
              agency: "agency_1",
              services: ["service_1"]
            }
          ]
        }
      }
    },
    application: {
      reportingLocationConfig: { admin_level: 1 },
      agencies: [
        { id: 1, unique_id: "agency_1", name: { en: "Agency 1" }, services: ["service_1"] },
        { id: 2, unique_id: "agency_2", name: { en: "Agency 2" }, services: ["service_2"], disabled: true },
        { id: 3, unique_id: "agency_3", name: { en: "Agency 3" }, services: ["service_1"] }
      ],
      referralAuthorizationRoles: {
        data: [],
        loading: false,
        errors: false
      }
    }
  });

  const initialProps = {
    formID: "referral-form",
    providedConsent: true,
    canConsentOverride: true,
    record: fromJS({ module_id: "module_1" }),
    recordType: "record_type_1",
    setDisabled: () => {},
    setPending: () => {},
    handleClose: () => {}
  };

  it("should render enabled agencies if there is no selected service", () => {
    mountedComponent(<Referrals {...initialProps} />, initialState);

    expect(screen.queryAllByRole("combobox")).toHaveLength(4);
  });

  it("should render only those agencies with service_1", () => {
    mountedComponent(<Referrals {...initialProps} />, initialState);

    expect(screen.queryAllByRole("combobox")).toHaveLength(4);
  });

  describe("when a user is selected", () => {
    it("should set the correct agency and location", () => {
      mountedComponent(<Referrals {...initialProps} />, initialState);

      expect(screen.queryAllByRole("combobox")).toHaveLength(4);
    });

    describe("and his agency is disabled", () => {
      it("should set the location but not the agency", () => {
        mountedComponent(<Referrals {...initialProps} />, initialState);

        expect(screen.queryAllByRole("combobox")).toHaveLength(4);
      });
    });
  });
});
