import { mountedComponent, screen } from "test-utils";

import { FILTER_TYPES } from "../../../index-filters";

import AdminFilters from "./component";

describe("<AdminFilters /> - pages/admin/components/filters/component", () => {
  const props = {
    filters: [
      {
        name: "filter.test",
        field_name: "test",
        type: FILTER_TYPES.MULTI_TOGGLE,
        option_strings_source: null,
        options: {
          en: [{ id: "test", display_name: "Test" }]
        }
      }
    ],
    onSubmit: () => {},
    clearFields: [],
    defaultFilters: {}
  };

  beforeEach(() => {
    mountedComponent(<AdminFilters {...props} />, {});
  });

  it("should render <FormProvider /> component", () => {
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  describe("when the filters include a non-permitted one to the user", () => {
    const propsWithFiltersNotPermitted = {
      filters: [
        {
          name: "cases.filter_by.enabled_disabled",
          field_name: "disabled",
          type: FILTER_TYPES.MULTI_SELECT,
          option_strings_source: null,
          options: {
            en: [
              { id: "false", display_name: "Enabled" },
              { id: "true", display_name: "Disabled" }
            ]
          }
        },
        {
          name: "filter.agency",
          field_name: "Agency",
          type: FILTER_TYPES.MULTI_SELECT,
          permitted_filter: false,
          options: {
            en: [{ id: "test", display_name: "Test" }]
          }
        }
      ],
      onSubmit: () => {},
      clearFields: [],
      defaultFilters: {}
    };

    beforeEach(() => {
      mountedComponent(<AdminFilters {...propsWithFiltersNotPermitted} />, {});
    });

    it("should render only one <SelectFilter /> component", () => {
      const selectFilterComponents = screen.getAllByTestId("select-filter");

      expect(selectFilterComponents).toHaveLength(1);
    });
  });

  it("should render <SearchBox /> component", () => {
    const searchBoxProps = {
      ...props,
      showSearchField: true,
      searchFieldLabel: "This is a label"
    };

    mountedComponent(<AdminFilters {...searchBoxProps} />);

    expect(screen.queryByText("This is a label")).toBeInTheDocument();
  });
});
