import { fromJS } from "immutable";
import { parseISO, format } from "date-fns";

import { DATE_TIME_FORMAT } from "../../../../config";
import { setupMountedComponent, lookups } from "../../../../test";
import IndexTable from "../../../index-table";
import { ACTIONS } from "../../../../libs/permissions";

import NAMESPACE from "./namespace";
import ConfigurationsList from "./container";

describe("<ConfigurationsList />", () => {
  let component;
  const createdOn = "2020-08-26T15:35:13.720Z";

  const data = [
    {
      id: "ac3d041c-1592-4f99-8191-b38fbe448735",
      name: "SWIMS - 20200903",
      description: "September 2020 baseline",
      version: "20200826.113513.25bf89a",
      created_on: createdOn,
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
          primero_configurations: [ACTIONS.MANAGE]
        }
      },
      forms: {
        options: {
          lookups: lookups()
        }
      }
    });

    ({ component } = setupMountedComponent(ConfigurationsList, {}, initialState, [`/admin/${NAMESPACE}`]));
  });

  it("should render record list table", () => {
    expect(component.find(IndexTable)).to.have.length(1);
  });

  it("should use correct date format", () => {
    const table = component.find(IndexTable);
    const dateColumnFormat = table.find("tr").at(1).find("td").at(3).find("div").at(1).text();

    expect(table).to.have.length(1);
    expect(dateColumnFormat).to.be.equal(format(parseISO(createdOn), DATE_TIME_FORMAT));
  });
});
