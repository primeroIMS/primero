import { expect } from "chai";
import { fromJS } from "immutable";
import MUIDataTable from "mui-datatables";

import { LoadingIndicator } from "../loading-indicator";
import { setupMountedComponent } from "../../test";

import IndexTable from "./component";

describe("<IndexTable />", () => {
  let component;
  const props = {
    onTableChange: () => {},
    recordType: "cases",
    defaultFilters: fromJS({}),
    bypassInitialFetch: true
  };

  const initialState = fromJS({
    records: {
      cases: {
        data: [
          {
            sex: "male",
            owned_by_agency_id: 1,
            record_in_scope: true,
            created_at: "2020-01-07T14:27:04.136Z",
            name: "G P",
            alert_count: 0,
            case_id_display: "96f613f",
            owned_by: "primero_cp",
            status: "open",
            registration_date: "2020-01-07",
            id: "d9df44fb-95d0-4407-91fd-ed18c19be1ad",
            flag_count: 0,
            short_id: "96f613f",
            age: 26,
            workflow: "new"
          }
        ],
        filters: {
          status: ["open"]
        },
        loading: false,
        errors: false,
        metadata: {
          total: 1,
          per: 20,
          page: 1
        }
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(IndexTable, props, initialState));
  });

  it("should render LoadingIndicator", () => {
    expect(component.find(LoadingIndicator)).to.have.lengthOf(1);
  });

  it("should render MUIDataTable", () => {
    expect(component.find(MUIDataTable)).to.have.lengthOf(1);
  });
});
