import { fromJS } from "immutable";
import MUIDataTable, { TableBodyRow } from "mui-datatables";

import { setupMountedComponent } from "../../../test";
import { DashboardChip } from "../../dashboard";
import { ListHeaderRecord } from "../../user/records";

import TaskList from "./container";

describe("<TaskList />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      TaskList,
      {},
      fromJS({
        records: {
          tasks: {
            data: [
              {
                id: "0df32f52-4290-4ce1-b859-74ac14c081bf",
                record_type: "case",
                record_id_display: "040e0b7",
                priority: "high",
                type: "service",
                due_date: "2019-07-01",
                detail: "a"
              },
              {
                id: "0df32f52-4290-4ce1-b859-74ac14c081bf",
                record_type: "case",
                record_id_display: "040e0b7",
                priority: "low",
                type: "service",
                due_date: "2019-07-01",
                detail: "b"
              }
            ],
            metadata: {
              total: 2,
              per: 20,
              page: 1
            }
          }
        },
        user: {
          listHeaders: {
            tasks: [
              ListHeaderRecord({
                name: "id",
                field_name: "record_id_display",
                id_search: false
              }),
              ListHeaderRecord({
                name: "priority",
                field_name: "priority",
                id_search: false
              }),
              ListHeaderRecord({
                name: "type",
                field_name: "type",
                id_search: false
              }),
              ListHeaderRecord({
                name: "due_date",
                field_name: "due_date",
                id_search: false
              }),
              ListHeaderRecord({
                name: "status",
                field_name: "status",
                id_search: false
              })
            ]
          }
        },
        forms: {
          options: {
            lookups: {
              data: [
                {
                  id: 1,
                  unique_id: "lookup-service-type",
                  values: [
                    { id: "a", display_text: { en: "Service a" } },
                    { id: "b", display_text: { en: "Service b" } }
                  ]
                }
              ]
            }
          }
        }
      })
    ).component;
  });

  it("renders tasks table", () => {
    expect(component.find(MUIDataTable).find(TableBodyRow)).to.have.length(2);
  });
  it("renders tasks table with priority as DashboardChip", () => {
    expect(component.find(MUIDataTable).find(DashboardChip)).to.have.length(2);
  });
});
