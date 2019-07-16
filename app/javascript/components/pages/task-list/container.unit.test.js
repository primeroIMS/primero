import { expect } from "chai";
import "test/test.setup";
import { setupMountedComponent } from "test";
import { fromJS, Map, List } from "immutable";
import MUIDataTable from "mui-datatables";
import { TableBodyRow } from "mui-datatables";
import TaskList from "./container";

describe("<TaskList />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      TaskList,
      {},
      Map({
        records: Map({
          Tasks: {
            tasks: fromJS([
              {
                id: "123",
                priority: "high",
                type: "Shelter temprary house",
                due_date: "2019-07-01",
                overdue: "true"
              },
              {
                id: "456",
                priority: "low",
                type: "Food service",
                due_date: "2019-07-01",
                overdue: "false"
              }
            ]),
          }
        })
      })
    ).component;
  });

  it("renders tasks table", () => {
    expect(component.find(MUIDataTable).find(TableBodyRow)).to.have.length(2);
  });
});
