import { expect } from "chai";
import { fromJS } from "immutable";
import {
  Card,
  CardContent,
  CardActionArea,
  TablePagination,
  Box
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { setupMountedComponent } from "../../../test";
import { PERMISSION_CONSTANTS } from "../../../libs/permissions";

import Reports from "./container";

describe("<Reports /> - Component", () => {
  let component;

  const initialState = fromJS({
    user: {
      permissions: {
        reports: [PERMISSION_CONSTANTS.MANAGE]
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
        ]
      }
    }
  });

  beforeEach(() => {
    ({ component } = setupMountedComponent(Reports, {}, initialState));
  });

  it("should render <Card>", () => {
    expect(component.find(Card)).to.have.lengthOf(1);
  });

  it("should render <CardActionArea>", () => {
    expect(component.find(CardActionArea)).to.have.lengthOf(1);
  });

  it("should render <CardContent>", () => {
    expect(component.find(CardContent)).to.have.lengthOf(1);
  });

  it("should render <Box>", () => {
    expect(component.find(Box)).to.have.lengthOf(1);
  });

  it("should render <TablePagination>", () => {
    expect(component.find(TablePagination)).to.have.lengthOf(1);
  });

  it("should render <AddIcon>", () => {
    expect(component.find(AddIcon)).to.have.lengthOf(1);
  });

  describe("When doesn't have permission to create report", () => {
    beforeEach(() => {
      ({ component } = setupMountedComponent(
        Reports,
        {},
        initialState.get("records")
      ));
    });

    it("should not render AddIcon", () => {
      expect(component.find(AddIcon)).to.have.lengthOf(0);
    });
  });
});
