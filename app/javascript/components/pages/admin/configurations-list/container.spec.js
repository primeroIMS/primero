import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";
import { parseISO, format } from "date-fns";

import { DATE_TIME_FORMAT } from "../../../../config";
import { lookups } from "../../../../test";
import { ACTIONS } from "../../../permissions";

import NAMESPACE from "./namespace";
import ConfigurationsList from "./container";

describe("<ConfigurationsList />", () => {
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

    mountedComponent(<ConfigurationsList />, initialState, [`/admin/${NAMESPACE}`]);
  });

  it("should render record list table", () => {
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("should use correct date format", () => {
    expect(screen.getByText(format(parseISO(createdOn), DATE_TIME_FORMAT))).toBeInTheDocument();
  });
});
