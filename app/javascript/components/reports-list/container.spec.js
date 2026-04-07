import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import { ACTIONS } from "../permissions";

import Reports from "./container";

describe("<Reports /> - Component", () => {
  const initialState = fromJS({
    user: {
      permissions: {
        reports: [ACTIONS.MANAGE]
      }
    },
    records: {
      reports: {
        data: [
          {
            id: 1,
            name: {
              en: "Registration CP"
            },
            description: {
              en: "Case registrations over time"
            },
            graph: true,
            graph_type: "bar",
            fields: [
              {
                name: "registration_date",
                display_name: {
                  en: "Date of Registration or Interview"
                },
                position: {
                  type: "horizontal",
                  order: 0
                }
              }
            ]
          }
        ],
        metadata: {
          total: 15,
          per: 20,
          page: 1
        },
        loading: false,
        errors: false
      }
    }
  });

  beforeEach(() => {
    mountedComponent(<Reports />, initialState);
  });

  it("should render <IndexTable>", () => {
    expect(screen.getAllByText("reports.label")).toBeTruthy();
  });

  describe("When doesn't have permission to create report", () => {
    it("should not render AddIcon", () => {
      mountedComponent(<Reports />, initialState.get("records"));
      const addIconElement = screen.queryByTestId("add-icon");

      expect(addIconElement).not.toBeInTheDocument();
    });
  });
});
