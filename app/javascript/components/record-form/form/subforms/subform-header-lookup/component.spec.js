// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../test-utils";

import SubformLookupHeader from ".";

describe("<SubformLookupHeader /> - Form - Subforms", () => {
  const initialState = fromJS({
    records: {
      transitions: {
        referral: {
          users: [
            { id: "test_user1", user_name: "test_user1" },
            { id: "test_user2", user_name: "test_user2" }
          ]
        }
      }
    },
    forms: {
      options: {
        lookups: [
          {
            unique_id: "lookup-location-type",
            values: [
              { id: "country", display_text: { en: "Country", es: "Pais" } },
              { id: "region", display_text: { en: "Region", es: "Region" } },
              {
                id: "province",
                display_text: { en: "Province", es: "Provincia" }
              }
            ]
          },
          {
            unique_id: "lookup-service-type",
            values: [
              { id: "service_1", display_text: { en: "Service 1", es: "Servicio 1" } },
              { id: "service_2", display_text: { en: "Service 2", es: "Servicio 2" }, disabled: true }
            ]
          }
        ]
      }
    }
  });

  it("should render the display_text of the lookup defined on the optionsStringSource", () => {
    const props = {
      value: "region",
      optionsStringSource: "lookup lookup-location-type"
    };

    mountedComponent(<SubformLookupHeader {...props} />, initialState);
    expect(screen.getByText(/Region/i)).toBeInTheDocument();
  });

  it("should render the user name of the lookup defined on the optionsStringSource", () => {
    const props = {
      value: "test_user1",
      optionsStringSource: "User"
    };

    mountedComponent(<SubformLookupHeader {...props} />, initialState);
    expect(screen.getByText(/test_user1/i)).toBeInTheDocument();
  });

  it("should render the value if there are no options for the defined optionsStringSource", () => {
    const props = {
      value: "the_value",
      optionsStringSource: "lookup lookup-doesnotexist"
    };

    mountedComponent(<SubformLookupHeader {...props} />, initialState);
    expect(screen.getByText(/the_value/i)).toBeInTheDocument();
  });

  it("should render the same value is this is empty", () => {
    const props = {
      value: "",
      optionsStringSource: "lookup lookup-location-type"
    };

    mountedComponent(<SubformLookupHeader {...props} />, initialState);
    expect(screen.queryByTestId("subForm-header")).toBeNull();
  });

  it("should render display_text from the values defined on the optionsStringText", () => {
    const props = {
      value: "test_2",
      optionsStringSource: "",
      optionsStringText: [
        {
          id: "test_1",
          display_text: {
            en: "Test 1",
            fr: ""
          }
        },
        {
          id: "test_2",
          display_text: {
            en: "Test 2",
            fr: ""
          }
        },
        {
          id: "test_3",
          display_text: {
            en: "Test 3",
            fr: ""
          }
        }
      ]
    };

    mountedComponent(<SubformLookupHeader {...props} />, initialState);
    expect(screen.getByText(/Test 2/i)).toBeInTheDocument();
  });

  it("should render the lookup even if it's disabled", () => {
    const props = {
      value: "service_2",
      optionsStringSource: "lookup lookup-service-type"
    };

    mountedComponent(<SubformLookupHeader {...props} />, initialState);
    expect(screen.getByText(/Service 2/i)).toBeInTheDocument();
  });

  it("should render the displayName if it is a volation", () => {
    const props = {
      value: "region",
      optionsStringSource: "lookup lookup-location-type",
      isViolationSubform: true,
      displayName: {
        en: "Testing Display Name"
      }
    };

    mountedComponent(<SubformLookupHeader {...props} />, initialState);
    expect(screen.getByText(/Region/i)).toBeInTheDocument();
  });

  describe("when optionsStringSource is violations", () => {
    it("should render a label with violation type", () => {
      const props = {
        value: "53d06bac-e072-4a7f-ac86-38548e727022",
        optionsStringSource: "violations",
        associatedViolations: {
          killing: ["53d06bac-e072-4a7f-ac86-38548e727022"]
        }
      };

      mountedComponent(<SubformLookupHeader {...props} />, initialState);
      expect(screen.getByText(/incident.violation.types.killing - e727022/i)).toBeInTheDocument();
    });
  });
});
