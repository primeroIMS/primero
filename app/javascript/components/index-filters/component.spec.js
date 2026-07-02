import { screen, mountedComponent, userEvent, setScreenSizeToMobile } from "test-utils";
import { fromJS } from "immutable";

import { useApp } from "../application";

import IndexFilters from "./component";

jest.mock("../application", () => ({
  ...jest.requireActual("../application"),
  useApp: jest.fn()
}));

describe("<IndexFitlers>", () => {
  beforeAll(() => {
    setScreenSizeToMobile(false);
  });

  beforeEach(() => {
    useApp.mockReturnValue({
      modules: fromJS([]),
      userModules: fromJS([]),
      online: true
    });
  });

  const state = fromJS({
    user: {
      filters: {
        cases: [
          {
            name: "cases.filter_by.status",
            field_name: "status",
            option_strings_source: "lookup-case-status",
            options: [],
            type: "checkbox",
            sort_options: false,
            toggle_include_disabled: false
          }
        ]
      }
    }
  });

  const props = {
    recordType: "incidents"
  };

  it("renders search bar", () => {
    mountedComponent(<IndexFilters {...props} />, state);
    expect(screen.getByTestId("search-text-input")).toBeInTheDocument();
  });

  it("renders FilterActions filters", () => {
    mountedComponent(<IndexFilters {...props} />, state);
    expect(screen.getByText("filters.apply_filters")).toBeInTheDocument();
    expect(screen.getByText("filters.clear_filters")).toBeInTheDocument();
  });

  it("renders SearchBox", () => {
    mountedComponent(<IndexFilters {...props} />, state);
    expect(screen.getByText("navigation.search_by")).toBeInTheDocument();
    expect(screen.getByText("navigation.id_search.help_text")).toBeInTheDocument();
  });

  it("clear filters button is clicked", async () => {
    const clearFiltersSpy = jest.fn();
    const propFilters = {
      ...props,
      defaultFilters: fromJS({
        record_state: ["true"],
        status: ["open"],
        risk_level: ["medium"]
      }),
      setSelectedRecords: clearFiltersSpy,
      metadata: {}
    };
    const user = userEvent.setup();

    mountedComponent(<IndexFilters {...propFilters} />, state);
    const clearFiltersButton = screen.getByText("filters.clear_filters");

    await user.click(clearFiltersButton);

    expect(clearFiltersSpy).toHaveBeenCalled();
  });

  it("applies id_search when searching an ID query without touching the search type toggle", async () => {
    const searchProps = { ...props, setSelectedRecords: jest.fn(), metadata: {} };
    const user = userEvent.setup();

    const { store } = mountedComponent(<IndexFilters {...searchProps} />, state);

    await user.type(screen.getByRole("textbox"), "aksjdferui84957r{enter}");

    const setFiltersActions = store.getActions().filter(action => action.type === "incidents/SET_FILTERS");
    const { payload } = setFiltersActions[setFiltersActions.length - 1];

    expect(payload).toEqual(expect.objectContaining({ query: "aksjdferui84957r", id_search: true }));
  });

  it("does not apply id_search when searching by Name (phonetic)", async () => {
    const searchProps = { ...props, setSelectedRecords: jest.fn(), metadata: {} };
    const user = userEvent.setup();

    const { store } = mountedComponent(<IndexFilters {...searchProps} />, state);

    await user.click(screen.getByRole("button", { name: "navigation.search_options.phonetic" }));
    await user.type(screen.getByRole("textbox"), "jane doe{enter}");

    const setFiltersActions = store.getActions().filter(action => action.type === "incidents/SET_FILTERS");
    const { payload } = setFiltersActions[setFiltersActions.length - 1];

    expect(payload).toEqual(expect.objectContaining({ query: "jane doe", phonetic: true }));
    expect(payload).not.toHaveProperty("id_search");
  });

  it("clear filters button includes module_id when user has multiple modules", async () => {
    useApp.mockReturnValue({
      modules: fromJS([{ unique_id: "cases" }, { unique_id: "incidents" }]),
      userModules: fromJS([{ unique_id: "cases" }, { unique_id: "incidents" }]),
      online: true
    });

    const clearFiltersSpy = jest.fn();
    const propFilters = {
      ...props,
      defaultFilters: fromJS({
        record_state: ["true"],
        status: ["open"],
        risk_level: ["medium"]
      }),
      setSelectedRecords: clearFiltersSpy,
      metadata: {}
    };
    const user = userEvent.setup();

    const { store } = mountedComponent(<IndexFilters {...propFilters} />, state);
    const clearFiltersButton = screen.getByText("filters.clear_filters");

    await user.click(clearFiltersButton);

    const actions = store.getActions();
    const setFiltersAction = actions.find(action => action.type === "incidents/SET_FILTERS");

    expect(setFiltersAction).toBeDefined();
    expect(setFiltersAction.payload).toEqual(
      expect.objectContaining({
        module_id: ["cases", "incidents"]
      })
    );
  });
});
