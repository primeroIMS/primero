import { fromJS } from "immutable";

import { mountedComponent, stub, screen } from "../../../../test-utils";
import { listHeaders } from "../../../../test";
import { ListHeaderRecord } from "../../../user/records";
import { ACTIONS } from "../../../permissions";

import NAMESPACE from "./namespace";
import LocationsList from "./container";

describe("<LocationsList />", () => {
  let stubI18n = null;
  const dataLength = 30;
  const data = Array.from({ length: dataLength }, (_, i) => ({
    id: i + 1,
    name: { en: `Location ${i + 1}` }
  }));

  stubI18n = stub(window.I18n, "t")
    .withArgs("messages.record_list.of")
    .returns("of")
    .withArgs("location.no_location")
    .returns("No Location");

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
    const initialState = fromJS({
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
      mountedComponent(<LocationsList />, initialState, ["/admin/locations"]);
      expect(screen.getByText(/No Location/i)).toBeInTheDocument();
    });
  });
});
