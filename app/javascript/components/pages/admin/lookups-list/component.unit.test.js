import { fromJS } from "immutable";
import MUIDataTable from "mui-datatables";
import { TableCell, TableHead } from "@material-ui/core";

import { setupMountedComponent, lookups, stub } from "../../../../test";
import { PageHeading } from "../../../page";
import { ACTIONS } from "../../../../libs/permissions";
import IndexTable from "../../../index-table";

import LookupList from "./component";

describe("<LookupList />", () => {
  let stubI18n = null;
  let component;

  const dataLength = 30;
  const data = Array.from({ length: dataLength }, (_, i) => ({
    id: i + 1,
    unique_id: `lookup-${i + 1}`,
    name: { en: `User Group ${i + 1}` },
    values: [
      {
        id: `value-${i + 1}`,
        display_text: {
          en: `Value ${i + 1}`
        }
      }
    ]
  }));
  const state = fromJS({
    records: {
      admin: {
        lookups: {
          data,
          metadata: { total: dataLength, per: 20, page: 1 },
          loading: false,
          errors: false
        }
      }
    },
    user: {
      permissions: {
        metadata: [ACTIONS.MANAGE]
      }
    },
    forms: {
      options: {
        lookups: lookups()
      }
    }
  });

  beforeEach(() => {
    stubI18n = stub(window.I18n, "t").withArgs("messages.record_list.of").returns("of");
    ({ component } = setupMountedComponent(LookupList, {}, state, ["/admin/lookups"]));
  });

  it("renders a PageHeading component", () => {
    expect(component.find(PageHeading)).to.have.lengthOf(1);
  });

  it("renders a MUIDataTable component", () => {
    expect(component.find(MUIDataTable)).to.have.lengthOf(1);
  });

  it("should trigger a sort action when a header is clicked", () => {
    const indexTable = component.find(IndexTable);

    const expectedAction = {
      payload: {
        recordType: "lookups",
        data: fromJS({
          total: 30,
          per: 20,
          page: 1,
          locale: "en",
          order: "asc",
          order_by: "name"
        })
      },
      type: "admin/lookups/SET_LOOKUPS_FILTER"
    };

    indexTable.find(TableHead).find(TableCell).at(0).find("span.MuiButtonBase-root").simulate("click");

    expect(component.props().store.getActions()[2].type).to.deep.equals(expectedAction.type);
    expect(component.props().store.getActions()[2].payload.data).to.deep.equals(expectedAction.payload.data);
  });

  it("should trigger a valid action with next page when clicking next page", () => {
    const indexTable = component.find(IndexTable);
    const expectAction = {
      api: {
        params: fromJS({ total: dataLength, per: 20, page: 2, locale: "en" }),
        path: "lookups"
      },
      type: "admin/lookups/FETCH_LOOKUPS"
    };

    expect(indexTable.find("p").at(1).text()).to.be.equals(`1-20 of ${dataLength}`);
    expect(component.props().store.getActions()).to.have.lengthOf(2);
    indexTable.find("#pagination-next").at(0).simulate("click");

    expect(indexTable.find("p").at(1).text()).to.be.equals(`21-${dataLength} of ${dataLength}`);
    expect(component.props().store.getActions()[3].api.params.toJS()).to.deep.equals(expectAction.api.params.toJS());
    expect(component.props().store.getActions()[3].type).to.deep.equals(expectAction.type);
    expect(component.props().store.getActions()[3].api.path).to.deep.equals(expectAction.api.path);
  });

  afterEach(() => {
    if (stubI18n) {
      window.I18n.t.restore();
    }
  });
});
