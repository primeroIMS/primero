/* eslint-disable prefer-destructuring */
import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import React from "react";
import { Route } from "react-router-dom";
import { Map, List } from "immutable";
import { PageContainer } from "components/page";
import { LoadingIndicator } from "components/loading-indicator";
import RecordForms from "./container";

describe("<RecordForms /> - Component", () => {
  let component;

  before(() => {
    const routedComponent = initialProps => {
      return (
        <Route
          path="/:recordType(cases|incidents|tracing_requests)/:id"
          component={props => (
            <RecordForms {...{ ...props, ...initialProps }} />
          )}
        />
      );
    };
    ({ component } = setupMountedComponent(
      routedComponent,
      {
        mode: "show"
      },
      Map({
        records: Map({
          cases: Map({
            data: List([
              Map({
                id: "e15acbe5-9501-4615-9f43-cb6873997fc1",
                age: 26,
                sex: "male",
                name: "Gerald Padgett",
                owned_by: "primero",
                created_at: "2019-08-06T20:21:19.864Z",
                case_id_display: "2063a4b",
                registration_date: "2019-08-06"
              })
            ]),
            metadata: Map({ per: 20, page: 1, total: 1 }),
            filters: Map({ status: "open" })
          })
        })
      }),
      ["/cases/2b8d6be1-1dc4-483a-8640-4cfe87c71610"]
    ));
  });

  it("renders the PageContainer", () => {
    expect(component.find(PageContainer)).to.have.length(1);
  });

  it("renders the LoadingIndicator", () => {
    expect(component.find(LoadingIndicator)).to.have.length(1);
  });
});
