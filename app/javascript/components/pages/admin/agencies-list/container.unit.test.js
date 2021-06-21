import { fromJS } from "immutable";
import { Button, TableCell, TableHead } from "@material-ui/core";
import { expect } from "chai";

import { setupMountedComponent, listHeaders, lookups, stub } from "../../../../test";
import IndexTable from "../../../index-table";
import { ACTIONS } from "../../../../libs/permissions";
import { FiltersForm } from "../../../form-filters/components";

import NAMESPACE from "./namespace";
import AgenciesList from "./container";

describe("<AgenciesList />", () => {
  let stubI18n = null;
  let component;
  const dataLength = 30;
  const data = Array.from({ length: dataLength }, (_, i) => ({
    id: i + 1,
    name: { en: `Agency ${i + 1}` },
    description: { en: `Agency description ${i + 1}` }
  }));

  beforeEach(() => {
    stubI18n = stub(window.I18n, "t").withArgs("messages.record_list.of").returns("of");
    const initialState = fromJS({
      records: {
        agencies: {
          data,
          metadata: { total: dataLength, per: 20, page: 1 },
          loading: false,
          errors: false
        }
      },
      forms: {
        options: {
          lookups: lookups()
        }
      },
      user: {
        permissions: {
          agencies: [ACTIONS.MANAGE]
        },
        listHeaders: {
          agencies: listHeaders(NAMESPACE)
        }
      }
    });

    ({ component } = setupMountedComponent(AgenciesList, {}, initialState, ["/admin/agencies"]));
  });

  it("renders record list table", () => {
    expect(component.find(IndexTable)).to.have.lengthOf(1);
  });

  it("renders <FiltersForm /> component", () => {
    expect(component.find(FiltersForm)).to.have.lengthOf(1);
  });

  it("should trigger a sort action when a header is clicked", () => {
    const indexTable = component.find(IndexTable);

    const expectedAction = {
      payload: {
        recordType: "agencies",
        data: fromJS({
          disabled: ["false"],
          total: 30,
          per: 20,
          page: 1,
          locale: "en",
          order: "asc",
          order_by: "name"
        })
      },
      type: "agencies/SET_AGENCIES_FILTER"
    };

    indexTable.find(TableHead).find(TableCell).at(0).find("span.MuiButtonBase-root").simulate("click");

    expect(component.props().store.getActions()[2].type).to.deep.equals(expectedAction.type);
    expect(component.props().store.getActions()[2].payload.data).to.deep.equals(expectedAction.payload.data);
  });

  it("should trigger a valid action with next page when clicking next page", () => {
    const indexTable = component.find(IndexTable);
    const expectAction = {
      api: {
        params: fromJS({ total: dataLength, per: 20, page: 2, disabled: ["false"], locale: "en", managed: true }),
        path: NAMESPACE
      },
      type: "agencies/AGENCIES"
    };

    expect(indexTable.find("p").at(1).text()).to.be.equals(`1-20 of ${dataLength}`);
    expect(component.props().store.getActions()).to.have.lengthOf(2);

    indexTable.find("#pagination-next").at(0).simulate("click");

    expect(indexTable.find("p").at(1).text()).to.be.equals(`21-${dataLength} of ${dataLength}`);
    expect(component.props().store.getActions()[2].type).to.deep.equals("agencies/SET_AGENCIES_FILTER");
    expect(component.props().store.getActions()[3].api.params).to.deep.equals(expectAction.api.params);
    expect(component.props().store.getActions()[3].api.path).to.deep.equals(expectAction.api.path);
    expect(component.props().store.getActions()[3].type).to.deep.equals(expectAction.type);
  });

  it("should set the filters when apply is clicked", () => {
    component.find(Button).at(2).simulate("click");

    const expectedAction = {
      payload: {
        data: fromJS({
          disabled: ["false"],
          locale: "en"
        })
      },
      type: "agencies/SET_AGENCIES_FILTER"
    };

    expect(component.props().store.getActions()[3].payload.type).to.deep.equals(expectedAction.payload.type);
    expect(component.props().store.getActions()[3].payload.data).to.deep.equals(expectedAction.payload.data);
  });

  afterEach(() => {
    if (stubI18n) {
      window.I18n.t.restore();
    }
  });
});
