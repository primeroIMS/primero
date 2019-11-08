import { expect } from "chai";
import React from "react";
import { Route } from "react-router-dom";
import { Map, List } from "immutable";

import IndexTable from "./../index-table";
import {MANAGE, DISPLAY_VIEW_PAGE} from "./../../libs/permissions";
import { setupMountedComponent } from "./../../test";
import { ViewModal } from "./../record-list/view-modal";

import RecordList from "./container";

describe("<RecordList />", () => {
  let component;

  beforeEach(() => {
    const initialState = Map({
      records: Map({
        FiltersTabs: Map({
          current: 0
        }),
        cases: Map({
          data: List([
            {
              id: "e15acbe5-9501-4615-9f43-cb6873997fc1",
              name: "Jose",
              record_state: true
            },
            {
              id: "7d55b677-c9c4-7c6c-7a41-bfa1c3f74d1c",
              name: "Carlos",
              record_state: true
            }
          ]),
          metadata: Map({ total: 2, per: 20, page: 1 }),
          filters: Map({
            id_search: false,
            query: ""
          })
        })
      }),
      user: Map({
        modules: ["primeromodule-cp"],
        listHeaders: Map({
          cases: List([{ id: "name", name: "Name", field_name: "name" }])
        }),
        permissions: Map({ cases: List([MANAGE, DISPLAY_VIEW_PAGE]) })
      }),
      application: Map({
        online: true,
        modules: [
          {
            unique_id: "primeromodule-cp",
            name: "CP",
            associated_record_types: ["case"]
          }
        ]
      })
    });

    const routedComponent = initialProps => {
      return (
        <Route
          path="/:recordType(cases|incidents|tracing_requests)"
          component={props => <RecordList {...{ ...props, ...initialProps }} />}
        />
      );
    };

    ({ component } = setupMountedComponent(routedComponent, {}, initialState, [
      "/cases"
    ]));
  });

  it("renders record list table", () => {
    expect(component.find(IndexTable)).to.have.length(1);
  });

  it("renders record list table", () => {
    expect(component.find(ViewModal)).to.have.lengthOf(1);
  });
});
