// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import last from "lodash/last";

import { setupMountedComponent } from "../../../../test";
import IndexTable from "../../../index-table";
import { ACTIONS } from "../../../permissions";
import { SelectFilter, ToggleFilter } from "../../../index-filters/components/filter-types";
import { FiltersForm } from "../../../form-filters/components";

import actions from "./actions";
import UsersList from "./container";

describe("<UsersList />", () => {
  let component;

  beforeEach(() => {
    const initialState = fromJS({
      records: {
        users: {
          data: [
            {
              id: "1",
              user_name: "Jose"
            },
            {
              id: "2",
              user_name: "Carlos"
            }
          ],
          metadata: { total: 2, per: 20, page: 1 }
        }
      },
      user: {
        permissions: {
          users: [ACTIONS.MANAGE]
        }
      }
    });

    ({ component } = setupMountedComponent(UsersList, {}, initialState, ["/admin/users"]));
  });

  it("renders record list table", () => {
    expect(component.find(IndexTable)).to.have.length(1);
  });

  it("renders FiltersForm", () => {
    expect(component.find(FiltersForm)).to.have.length(1);
  });

  it("submits the filters with the correct data", async () => {
    await component.find(FiltersForm).find("form").props().onSubmit();
    const setFiltersAction = last(
      component
        .props()
        .store.getActions()
        .filter(action => action.type === actions.SET_USERS_FILTER)
    );

    expect(setFiltersAction.payload).to.have.property("data");
  });

  it("renders ToggleFilter", () => {
    expect(component.find(ToggleFilter)).to.have.length(1);
  });

  it("renders FormFilters", () => {
    expect(component.find(SelectFilter)).to.have.length(1);
  });
});
