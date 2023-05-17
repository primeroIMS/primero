import { fromJS } from "immutable";
import { FormProvider } from "react-hook-form";
import { mountedComponent, screen } from "test-utils";
import { ACTIONS } from "../../../permissions";
import Actions from "../../../index-filters/components/actions";
import { FILTER_TYPES } from "../../../index-filters";
import { SelectFilter } from "../../../index-filters/components/filter-types";
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
    const state = fromJS({
      user: {
        user_name: "test",
        permissions: {
          agencies: [ACTIONS.MANAGE]
        }
      }
    });

    mountedComponent(<AdminFilters {...props}/>, {});
  });

  it("should render <FormProvider /> component", () => {
    expect(screen.getByRole("form")).toBeInTheDocument();
  });

  it("should render <Actions /> component", () => {
    expect(screen.getAllByRole("actions-component")).toHaveLength(1);
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
      const state = fromJS({
        user: {
          user_name: "test",
          permissions: {
            users: [ACTIONS.MANAGE, ACTIONS.AGENCY_READ]
          }
        }
      });

      mountedComponent(<AdminFilters {...propsWithFiltersNotPermitted}/>, {} );
    });

    it("should render only one <SelectFilter /> component", () => {
      expect(screen.getAllByRole("region")).toHaveLength(2);
    });
  });
});