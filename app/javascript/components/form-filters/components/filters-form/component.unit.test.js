import { fromJS } from "immutable";
import { FormProvider } from "react-hook-form";

import { setupMountedComponent } from "../../../../test";
import { ACTIONS } from "../../../../libs/permissions";
import Actions from "../../../index-filters/components/actions";
import { FILTER_TYPES } from "../../../index-filters";
import { SelectFilter } from "../../../index-filters/components/filter-types";

import AdminFilters from "./component";

describe("<AdminFilters /> - pages/admin/components/filters/component", () => {
  let component;

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

    ({ component } = setupMountedComponent(AdminFilters, props, state));
  });

  it("should render <FormProvider /> component", () => {
    expect(component.find(FormProvider)).to.have.lengthOf(1);
  });

  it("should render <Actions /> component", () => {
    expect(component.find(Actions)).to.have.lengthOf(1);
  });

  it("should have valid props", () => {
    const adminFiltersProps = { ...component.find(AdminFilters).props() };

    expect(component.find(adminFiltersProps)).to.have.lengthOf(1);
    [
      "clearFields",
      "closeDrawerOnSubmit",
      "defaultFilters",
      "filters",
      "initialFilters",
      "mobileDisplay",
      "onSubmit",
      "showDrawer"
    ].forEach(property => {
      expect(adminFiltersProps).to.have.property(property);
      delete adminFiltersProps[property];
    });
    expect(adminFiltersProps).to.be.empty;
  });

  context("when the filters include a non-permitted one to the user", () => {
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

      ({ component } = setupMountedComponent(AdminFilters, propsWithFiltersNotPermitted, state));
    });

    it("should render only one <SelectFilter /> component", () => {
      expect(component.find(FormProvider).find(SelectFilter)).to.have.lengthOf(1);
    });
  });
});
