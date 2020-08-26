import { fromJS } from "immutable";

import { setupMountedComponent, listHeaders, lookups } from "../../../../test";
import IndexTable from "../../../index-table";
import { ACTIONS } from "../../../../libs/permissions";

import NAMESPACE from "./namespace";
import ConfigurationsList from "./container";

describe("<ConfigurationsList />", () => {
  let component;
  const data = [
    {
      id: "ac3d041c-1592-4f99-8191-b38fbe448735",
      name: "SWIMS - 20200903",
      description: "September 2020 baseline",
      version: "20200826.113513.25bf89a",
      created_on: "2020-08-26T15:35:13.720Z",
      created_by: "primero_swims_admin",
      applied_on: null,
      applied_by: null
    }
  ];

  beforeEach(() => {
    const initialState = fromJS({
      records: {
        admin: {
          configurations: {
            data,
            metadata: { total: 1, per: 20, page: 1 },
            loading: false,
            errors: false
          }
        }
      },
      user: {
        permissions: {
          configurations: [ACTIONS.MANAGE]
        }
      }
    });

    ({ component } = setupMountedComponent(ConfigurationsList, {}, initialState, [`/admin/${NAMESPACE}`]));
  });

  it("should render record list table", () => {
    expect(component.find(IndexTable)).to.have.length(1);
  });
});
