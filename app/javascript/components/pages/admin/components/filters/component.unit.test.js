import { fromJS } from "immutable";
import { FormContext } from "react-hook-form";

import { setupMountedComponent, expect } from "../../../../../test";
import { ACTIONS } from "../../../../../libs/permissions";
import Actions from "../../../../index-filters/components/actions";
import { FILTER_TYPES } from "../../../../index-filters";

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
    clearFields: () => {},
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

  it("should render <FormContext /> component", () => {
    expect(component.find(FormContext)).to.have.lengthOf(1);
  });

  it("should render <Actions /> component", () => {
    expect(component.find(Actions)).to.have.lengthOf(1);
  });

  it("should have valid props", () => {
    const adminFiltersProps = { ...component.find(AdminFilters).props() };

    expect(component.find(adminFiltersProps)).to.have.lengthOf(1);
    ["filters", "onSubmit", "clearFields", "defaultFilters"].forEach(
      property => {
        expect(adminFiltersProps).to.have.property(property);
        delete adminFiltersProps[property];
      }
    );
    expect(adminFiltersProps).to.be.empty;
  });
});
