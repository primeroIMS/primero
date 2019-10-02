import { expect } from "chai";
import "test/test.setup";
import { setupMountedComponent } from "test";
import { fromJS, Map, List } from "immutable";
import MUIDataTable from "mui-datatables";
import { TableBodyRow } from "mui-datatables";
import TaskList from "./container";
import * as userRecord from "../../user/records";

describe("<TaskList />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      TaskList,
      {},
      Map({
        records: Map({
          tasks: Map({
            data: List([
              Map({
                id: "0df32f52-4290-4ce1-b859-74ac14c081bf",
                record_type: "case",
                record_id_display: "040e0b7",
                priority: "high",
                type: "Shelter temprary house",
                due_date: "2019-07-01",
              }),
              Map({
                id: "0df32f52-4290-4ce1-b859-74ac14c081bf",
                record_type: "case",
                record_id_display: "040e0b7",
                priority: "low",
                type: "Food service",
                due_date: "2019-07-01",
              })
            ]),
            metadata: Map({
              total: 2,
              per: 20,
              page: 1
            })
          })
        }),
        user: Map({
          listHeaders: Map({
            tasks: List([
              userRecord.ListHeaderRecord({
                name: 'id',
                field_name: 'record_id_display',
                id_search: false
              }),
              userRecord.ListHeaderRecord({
                name: 'priority',
                field_name: 'priority',
                id_search: false
              }),
              userRecord.ListHeaderRecord({
                name: 'type',
                field_name: 'type',
                id_search: false
              }),
              userRecord.ListHeaderRecord({
                name: 'due_date',
                field_name: 'due_date',
                id_search: false
              }),
              userRecord.ListHeaderRecord({
                name: 'status',
                field_name: 'status',
                id_search: false
              })
            ])
          })
        })
      })
    ).component;
  });

  it("renders tasks table", () => {
    expect(component.find(MUIDataTable).find(TableBodyRow)).to.have.length(2);
  });
});
