import { fromJS } from "immutable";

import { setupMountedComponent, expect } from "../../../../test";
import IndexTable from "../../../index-table";
import { ACTIONS } from "../../../../libs/permissions";
import { Filters as AdminFilters } from "../components";

import AgenciesList from "./container";

describe("<AgenciesList />", () => {
  let component;

  beforeEach(() => {
    const initialState = fromJS({
      records: {
        agencies: {
          data: [
            {
              id: "1",
              name: {
                en: "Agency 1"
              }
            },
            {
              id: "2",
              name: {
                en: "Agency 2"
              }
            }
          ],
          metadata: { total: 2, per: 20, page: 1 }
        }
      },
      user: {
        permissions: {
          agencies: [ACTIONS.MANAGE]
        }
      }
    });

    ({ component } = setupMountedComponent(AgenciesList, {}, initialState, [
      "/admin/agencies"
    ]));
  });

  it("renders record list table", () => {
    expect(component.find(IndexTable)).to.have.lengthOf(1);
  });

  it("renders <AdminFilters /> component", () => {
    expect(component.find(AdminFilters)).to.have.lengthOf(1);
  });
});
