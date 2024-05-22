// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { setupMountedComponent } from "../../test";

import IndexFilters from "./component";
import MoreSection from "./components/more-section";
import FilterActions from "./components/actions";

describe("<IndexFitlers>", () => {
  const state = fromJS({
    user: {
      filters: {
        cases: [
          {
            field_name: "filter1",
            name: "filter1",
            options: [{ id: "true", display_name: "Filter 1" }],
            type: "checkbox"
          }
        ]
      }
    }
  });

  const props = {
    recordType: "cases"
  };

  it("renders search bar", () => {
    const { component } = setupMountedComponent(IndexFilters, props, state);

    expect(component.exists("input#search-input")).to.be.true;
  });

  it("renders MoreSection filters", () => {
    const { component } = setupMountedComponent(IndexFilters, props, state);

    expect(component.find(MoreSection)).to.have.lengthOf(1);
  });

  it("renders FilterActions filters", () => {
    const { component } = setupMountedComponent(IndexFilters, props, state);

    expect(component.find(FilterActions)).to.have.lengthOf(1);
  });

  it("clear filters", () => {
    const propFilters = {
      ...props,
      defaultFilters: fromJS({
        record_state: ["true"],
        status: ["open"],
        risk_level: ["medium"]
      }),
      setSelectedRecords: () => {},
      metadata: {}
    };
    const { component } = setupMountedComponent(IndexFilters, propFilters, state, [
      "/cases?record_state[0]=true&status[0]=open&risk_level[0]=medium&page=1&per=20"
    ]);

    expect(component.props().store.getActions()).to.deep.equal([]);

    component.find(FilterActions).find("button").last().simulate("click");

    expect(component.props().store.getActions()[0]).to.deep.equals({
      type: "cases/SET_FILTERS",
      payload: { fields: "short", status: ["open"], record_state: ["true"] }
    });
  });

  it("renders component with valid props", () => {
    const { component } = setupMountedComponent(
      IndexFilters,
      { ...props, metadata: {}, setSelectedRecords: () => {} },
      state
    );
    const propsIndexFilters = component.find(IndexFilters).props();

    ["metadata", "recordType", "setSelectedRecords"].forEach(property => {
      expect(propsIndexFilters).to.have.property(property);
      delete propsIndexFilters[property];
    });
    expect(propsIndexFilters).to.be.empty;
  });
});
