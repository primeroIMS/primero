// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import Report from "./container";

describe("<Report />", () => {
  const initialState = fromJS({
    records: {
      reports: {
        loading: false,
        errors: false,
        selectedReport: {
          id: 1,
          name: {
            en: "Registration CP",
            es: "Registration CP"
          },
          description: {
            en: "Case registrations over time",
            es: "Case registrations over time"
          },
          graph: true,
          fields: [
            {
              name: "registration_date",
              display_name: {
                en: "Date of Registration or Interview",
                es: ""
              },
              position: {
                type: "horizontal",
                order: 0
              }
            }
          ],
          report_data: {
            "Feb-2020": {
              _total: 3
            }
          }
        }
      }
    }
  });

  it("renders report component", () => {
    mountedComponent(<Report />, initialState);
    expect(screen.getByText("Registration CP")).toBeInTheDocument();
  });

  it("renders TableValues", () => {
    mountedComponent(<Report />, initialState);
    expect(screen.getByText("a-2020")).toBeInTheDocument();
  });

  it("renders Exporter", () => {
    mountedComponent(<Report />, initialState);
    expect(document.querySelector("#graph-exporter-button")).toBeInTheDocument();
  });

  it("renders h4 with report's description", () => {
    mountedComponent(<Report />, initialState);
    expect(screen.getByText("Case registrations over time")).toBeInTheDocument();
  });

  describe("When data still loading", () => {
    const loadingInitialState = fromJS({
      records: {
        reports: {
          loading: true,
          errors: false,
          selectedReport: {}
        }
      }
    });

    it("renders report component", () => {
      mountedComponent(<Report />, loadingInitialState);
      expect(screen.getByTestId("page-heading")).toBeInTheDocument();
    });

    it("renders LoadingIndicator", () => {
      mountedComponent(<Report />, loadingInitialState);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
