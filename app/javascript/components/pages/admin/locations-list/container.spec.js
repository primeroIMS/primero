import { fromJS } from "immutable";

import { mountedComponent, screen, listHeaders } from "../../../../test-utils";
import { ListHeaderRecord } from "../../../user/records";
import { ACTIONS } from "../../../permissions";

import NAMESPACE from "./namespace";
import LocationsList from "./container";

describe("<LocationsList />", () => {
  const dataLength = 30;
  const data = Array.from({ length: dataLength }, (_, i) => ({
    id: i + 1,
    name: { en: `Location ${i + 1}` }
  }));

  jest.spyOn(window.I18n, "t").mockImplementation(arg => {
    if (arg === "messages.record_list.of") return "of";
    if (arg === "location.no_location") return "No Location";

    return arg;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  const initialState = fromJS({
    records: {
      admin: {
        locations: {
          data,
          metadata: { total: dataLength, per: 20, page: 1 },
          loading: false,
          errors: false
        }
      }
    },
    forms: {
      options: {
        lookups: {
          data: [
            {
              unique_id: "lookup-1",
              name: { en: "Lookup 1" },
              values: [
                { id: "a", display_text: [{ en: "Lookup 1 a" }] },
                { id: "b", display_text: [{ en: "Lookup 1 b" }] }
              ]
            },
            {
              unique_id: "lookup-2",
              name: { en: "Lookup 2" },
              values: [
                { id: "a", display_text: [{ en: "Lookup 2 a" }] },
                { id: "b", display_text: [{ en: "Lookup 2 b" }] }
              ]
            }
          ],
          metadata: {
            total: 2,
            per: 1,
            page: 1
          }
        },
        locations: [{ name: "Country 1" }]
      }
    },
    user: {
      permissions: {
        metadata: [ACTIONS.MANAGE]
      },
      listHeaders: {
        locations: [
          ListHeaderRecord({
            name: "name",
            field_name: "name",
            id_search: false
          })
        ]
      }
    }
  });

  it("renders record list table", () => {
    mountedComponent(<LocationsList />, initialState, ["/admin/locations"]);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("renders <FiltersForm /> component", () => {
    mountedComponent(<LocationsList />, initialState, ["/admin/locations"]);
    expect(screen.getByTestId("form-filter")).toBeInTheDocument();
  });

  it("renders <ImportDialog /> component", () => {
    mountedComponent(<LocationsList />, initialState, ["/admin/locations"]);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  describe("when no location loaded", () => {
    const stateWithoutLocations = fromJS({
      records: {
        admin: {
          locations: {
            data: [],
            metadata: { total: 0, per: 20, page: 1 },
            loading: false,
            errors: false
          }
        }
      },
      user: {
        permissions: {
          metadata: [ACTIONS.MANAGE]
        },
        listHeaders: {
          locations: listHeaders(NAMESPACE)
        }
      }
    });

    it("renders InternalAlert alert", () => {
      mountedComponent(<LocationsList />, stateWithoutLocations, ["/admin/locations"]);
      expect(screen.getByText(/No Location/i)).toBeInTheDocument();
    });
  });
});
