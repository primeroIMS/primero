// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { listHeaders, lookups, stub } from "../../../../test";
import { ACTIONS } from "../../../permissions";
import { fireEvent, mockFetchSuccess, mountedComponent, screen, waitFor } from "../../../../test-utils";

import NAMESPACE from "./namespace";
import AgenciesList from "./container";

describe("<AgenciesList />", () => {
  let stubI18n = null;
  let actions;
  let storeInstance;

  const dataLength = 30;
  const data = Array.from({ length: dataLength }, (_, i) => ({
    id: i + 1,
    name: { en: `Agency ${i + 1}` },
    description: { en: `Agency description ${i + 1}` }
  }));

  beforeEach(() => {
    stubI18n = stub(window.I18n, "t").withArgs("messages.record_list.of").returns("of");
    const initialState = fromJS({
      records: {
        agencies: {
          data,
          metadata: { total: dataLength, per: 20, page: 1 },
          loading: false,
          errors: false
        }
      },
      forms: {
        options: {
          lookups: lookups()
        }
      },
      user: {
        permissions: {
          agencies: [ACTIONS.MANAGE]
        },
        listHeaders: {
          agencies: listHeaders(NAMESPACE)
        }
      }
    });

    mockFetchSuccess({ json: { data, metadata: { total: 30, per: 20, page: 1 } } });

    const { store } = mountedComponent(<AgenciesList />, initialState, {}, ["/admin/agencies"], {}, "", true);

    storeInstance = store;
    actions = store.getActions();
  });

  it("renders record list table", () => {
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("renders <FiltersForm /> component", () => {
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("should trigger a sort action when a header is clicked", () => {
    const expectedAction = {
      payload: {
        recordType: "agencies",
        data: fromJS({
          disabled: ["false"],
          total: 30,
          per: 20,
          page: 1,
          locale: "en",
          order: "asc",
          order_by: "name"
        })
      },
      type: "agencies/SET_AGENCIES_FILTER"
    };

    fireEvent.click(screen.getByTestId("headcol-0"));

    expect(actions[2].type).toStrictEqual(expectedAction.type);
    expect(actions[2].payload.data).toStrictEqual(expectedAction.payload.data);
  });

  it("should trigger a valid action with next page when clicking next page", async () => {
    const expectAction = {
      api: {
        params: fromJS({ total: dataLength, per: 20, page: 2, disabled: ["false"], locale: "en", managed: true }),
        path: NAMESPACE
      },
      type: "agencies/AGENCIES"
    };

    expect(screen.getByText(`1-20 of ${dataLength}`)).toBeInTheDocument();
    expect(actions).toHaveLength(5);

    mockFetchSuccess({ json: { data, metadata: { total: 30, per: 20, page: 2 } } });
    fireEvent.click(screen.getByTestId("pagination-next"));
    const instanceActions = storeInstance.getActions();

    await waitFor(() => expect(screen.getByText(`21-${dataLength} of ${dataLength}`)).toBeInTheDocument());
    expect(instanceActions[1].type).toStrictEqual("agencies/SET_AGENCIES_FILTER");
    expect(instanceActions[6].api.params).toStrictEqual(expectAction.api.params);
    expect(instanceActions[6].api.path).toStrictEqual(expectAction.api.path);
    expect(instanceActions[6].type).toStrictEqual(expectAction.type);
  });

  it("should set the filters when apply is clicked", () => {
    mockFetchSuccess({ json: { data, metadata: { total: 30, per: 20, page: 1 } } });
    fireEvent.click(screen.getAllByRole("button").at(1));

    const expectedAction = {
      payload: { data: fromJS({ disabled: ["false"], locale: "en", total: 30, per: 20, page: 1 }) },
      type: "agencies/SET_AGENCIES_FILTER"
    };

    const action = actions[1];

    expect(action.type).toStrictEqual(expectedAction.type);
    expect(action.payload.data).toStrictEqual(expectedAction.payload.data);
  });

  afterEach(() => {
    if (stubI18n) {
      window.I18n.t.restore();
    }
  });
});
