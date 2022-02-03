import { fromJS } from "immutable";
import AddIcon from "@material-ui/icons/Add";

import { setupMountedComponent } from "../../test";
import { ACTIONS } from "../../libs/permissions";
import IndexTable from "../index-table";

import Reports from "./container";

describe("<Reports /> - Component", () => {
  let component;

  const initialState = fromJS({
    user: {
      permissions: {
        reports: [ACTIONS.MANAGE]
      }
    },
    records: {
      reports: {
        data: [
          {
            id: 1,
            name: {
              en: "Registration CP"
            },
            description: {
              en: "Case registrations over time"
            },
            graph: true,
            graph_type: "bar",
            fields: [
              {
                name: "registration_date",
                display_name: {
                  en: "Date of Registration or Interview"
                },
                position: {
                  type: "horizontal",
                  order: 0
                }
              }
            ]
          }
        ],
        metadata: {
          total: 15,
          per: 20,
          page: 1
        },
        loading: false,
        errors: false
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(Reports, {}, initialState));
  });

  it("should render <IndexTable>", () => {
    expect(component.find(IndexTable)).to.have.lengthOf(1);
  });

  // TODO: Should test if we have a clickable button, but removing button temporarly till this feature is implemented
  // it("should render <AddIcon>", () => {
  //   expect(component.find(AddIcon)).to.have.lengthOf(1);
  // });

  describe("When doesn't have permission to create report", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(Reports, {}, initialState.get("records")));
    });

    it("should not render AddIcon", () => {
      expect(component.find(AddIcon)).to.have.lengthOf(0);
    });
  });
});
