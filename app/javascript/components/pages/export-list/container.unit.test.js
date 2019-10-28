import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { PageContainer, PageHeading, PageContent } from "components/page";
import { IndexTable } from "components/index-table";
import { fromJS } from "immutable";
import MUIDataTable, { TableBodyRow } from "mui-datatables";
import ExportList from "./container";
import * as userRecord from "../../user/records";

describe("<ExportList />", () => {
  let component;

  const initialState = fromJS({
    records: {
      bulk_exports: {
        data: [
          {
            id: "d5e1a4a019ec727efd34a35d1d9a271e",
            file_name: "PRIMERO-CHILD-UNHCR.CSV",
            record_type: "Case",
            started_on: "05-Jul-2019 09:36"
          },
          {
            id: "d5e1a4a019ec727efd34a35d1d9a272e",
            file_name: "PRIMERO - CHILD.PDF",
            record_type: "Case",
            started_on: "05-Jul-2019 09:36"
          },
          {
            id: "d5e1a4a019ec727efd34a35d1d9a273e",
            file_name: "PRIMERO - CHILD.JSON",
            record_type: "Case",
            started_on: "05-Jul-2019 09:36"
          }
        ],
        metadata: {
          total: 15,
          per: 20,
          page: 1
        },
        errors: false
      }
    },
    user: {
      listHeaders: {
        bulk_exports: [
          userRecord.ListHeaderRecord({
            name: "file_name",
            field_name: "file_name",
            id_search: false
          }),
          userRecord.ListHeaderRecord({
            name: "record_type",
            field_name: "record_type",
            id_search: false
          }),
          userRecord.ListHeaderRecord({
            name: "started_on",
            field_name: "started_on",
            id_search: false
          })
        ]
      },
      permissions: {
        exports: ["manage"],
        bulk_exports: ["manage"]
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(ExportList, {}, initialState));
  });

  it("renders a table with three rows", () => {
    expect(component.find(MUIDataTable).find(TableBodyRow)).to.have.lengthOf(3);
  });

  it("should render <PageContainer>", () => {
    expect(component.find(PageContainer)).to.have.lengthOf(1);
  });

  it("should render <PageHeading>", () => {
    expect(component.find(PageHeading)).to.have.lengthOf(1);
  });

  it("should render <PageContent>", () => {
    expect(component.find(PageContent)).to.have.lengthOf(1);
  });

  it("should render <IndexTable>", () => {
    expect(component.find(IndexTable)).to.have.lengthOf(1);
  });
});
