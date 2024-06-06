// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { lookups, stub } from "../../../../test";
import { ACTIONS } from "../../../permissions";
import { fireEvent, mockFetchSuccess, mountedComponent, screen, waitFor } from "../../../../test-utils";

import LookupList from "./component";

describe("<LookupList />", () => {
  let stubI18n = null;
  let storeInstance;

  const dataLength = 30;
  const data = Array.from({ length: dataLength }, (_, i) => ({
    id: i + 1,
    unique_id: `lookup-${i + 1}`,
    name: { en: `User Group ${i + 1}` },
    values: [
      {
        id: `value-${i + 1}`,
        display_text: {
          en: `Value ${i + 1}`
        }
      }
    ]
  }));
  const state = fromJS({
    records: {
      admin: {
        lookups: {
          data,
          metadata: { total: dataLength, per: 20, page: 1 },
          loading: false,
          errors: false
        }
      }
    },
    user: {
      permissions: {
        metadata: [ACTIONS.MANAGE]
      }
    },
    forms: {
      options: {
        lookups: lookups()
      }
    }
  });

  beforeEach(() => {
    stubI18n = stub(window.I18n, "t").withArgs("messages.record_list.of").returns("of");
    mockFetchSuccess({ json: { data, metadata: { total: 30, per: 20, page: 1 } } });
    const { store } = mountedComponent(<LookupList />, state, {}, ["/admin/lookups"], {}, "", true);

    storeInstance = store;
  });

  it("renders a MUIDataTable component", () => {
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("should trigger a sort action when a header is clicked", () => {
    const expectedAction = {
      payload: {
        recordType: "lookups",
        data: fromJS({
          total: 30,
          per: 20,
          page: 1,
          locale: "en",
          order: "asc",
          order_by: "name"
        })
      },
      type: "admin/lookups/SET_LOOKUPS_FILTER"
    };

    fireEvent.click(screen.getByTestId("headcol-1"));

    expect(storeInstance.getActions()[2].type).toStrictEqual(expectedAction.type);
    expect(storeInstance.getActions()[2].payload.data).toStrictEqual(expectedAction.payload.data);
  });

  it("should trigger a valid action with next page when clicking next page", async () => {
    const expectAction = {
      api: {
        params: fromJS({ total: dataLength, per: 20, page: 2, locale: "en" }),
        path: "lookups"
      },
      type: "admin/lookups/FETCH_LOOKUPS"
    };

    expect(screen.getByText(`1-20 of ${dataLength}`)).toBeInTheDocument();
    expect(storeInstance.getActions()).toHaveLength(5);

    mockFetchSuccess({ json: { data, metadata: { total: 30, per: 20, page: 2 } } });
    fireEvent.click(screen.getByTestId("pagination-next"));

    await waitFor(() => expect(screen.getByText(`21-${dataLength} of ${dataLength}`)).toBeInTheDocument());
    expect(storeInstance.getActions()[6].api.params.toJS()).toStrictEqual(expectAction.api.params.toJS());
    expect(storeInstance.getActions()[6].type).toStrictEqual(expectAction.type);
    expect(storeInstance.getActions()[6].api.path).toStrictEqual(expectAction.api.path);
  });

  afterEach(() => {
    if (stubI18n) {
      window.I18n.t.restore();
    }
  });
});
