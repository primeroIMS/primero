// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../test-utils";
import users from "../../mocked-users";

import ReferralForm from "./component";

describe("<ReferralForm />", () => {
  describe("Create referral", () => {
    const initialState = fromJS({
      records: {
        transitions: {
          mockUsers: users
        }
      },
      application: {
        agencies: [{ unique_id: "agency-unicef", name: "UNICEF" }]
      },
      forms: {
        options: [
          {
            type: "lookup-service-type",
            options: [{ id: "health", display_text: "Health" }]
          },
          {
            type: "reporting_location",
            options: [{ id: "location_a", display_text: "Location A" }]
          }
        ]
      }
    });
    const record = fromJS({
      id: "03cdfdfe-a8fc-4147-b703-df976d200977",
      case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
      case_id_display: "9b4c525",
      name_first: "W",
      name_last: "D",
      name: "W D"
    });
    const props = {
      handleClose: () => {},
      canConsentOverride: false,
      providedConsent: false,
      recordType: "cases",
      record
    };

    it("renders Formik", () => {
      mountedComponent(<ReferralForm {...props} />, initialState);
      expect(document.querySelector("form")).toBeInTheDocument();
    });

    it("renders FormInternal", () => {
      mountedComponent(<ReferralForm {...props} />, initialState);
      expect(screen.queryAllByRole("textbox")).toHaveLength(5);
    });

    it("renders ProvidedConsent", () => {
      mountedComponent(<ReferralForm {...props} />, initialState);
      expect(screen.getByText(/referral.provided_consent_label/i)).toBeInTheDocument();
    });

    it("renders FormControlLabel", () => {
      mountedComponent(<ReferralForm {...props} />, initialState);
      expect(screen.queryAllByRole("textbox")).toHaveLength(5);
    });

    it("renders MuiCheckbox", () => {
      mountedComponent(<ReferralForm {...props} />, initialState);
      expect(screen.queryAllByRole("checkbox")).toHaveLength(1);
    });
  });

  describe("Create referral from service", () => {
    const serviceToRefer = {
      service_response_day_time: "2020-03-26T23:03:15.295Z",
      service_type: "health",
      unique_id: "683cd3a1-9711-4a7d-856b-33dc5d4b8b8b",
      service_response_type: "care_plan",
      service_status_referred: true,
      service_delivery_location: "94132416565b",
      service_is_referrable: true,
      service_implemented_day_time: null,
      service_appointment_date: null,
      service_implemented: "not_implemented",
      service_implementing_agency: "agency-health",
      service_implementing_agency_individual: "user-health"
    };
    const initialState = fromJS({
      records: {
        transitions: {
          mockUsers: users
        }
      },
      forms: {
        options: {
          lookups: [
            {
              type: "lookup-service-type",
              options: [{ id: "health", display_text: "Health" }]
            },
            {
              type: "reporting_location",
              options: [{ id: "location_a", display_text: "Location A" }]
            }
          ],
          agencies: [{ unique_id: "agency-unicef", name: "UNICEF" }]
        },
        serviceToRefer
      }
    });
    const record = fromJS({
      id: "03cdfdfe-a8fc-4147-b703-df976d200977",
      case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
      case_id_display: "9b4c525",
      name_first: "W",
      name_last: "D",
      name: "W D",
      services_section: [serviceToRefer]
    });
    const props = {
      handleClose: () => {},
      canConsentOverride: true,
      providedConsent: false,
      recordType: "cases",
      record
    };

    it("renders Formik", () => {
      mountedComponent(<ReferralForm {...props} />, initialState);
      expect(document.querySelector("form")).toBeInTheDocument();
    });
  });
});
