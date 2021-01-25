import { fromJS } from "immutable";
import { ListItemText } from "@material-ui/core";

import { setupMountedComponent } from "../../../../../../../test";
import IndexTable from "../../../../../../index-table";

import TraceMatches from "./component";

describe("<RecordForm>/form/subforms/<TraceMatches>", () => {
  let component;
  const props = {
    traceValues: {
      unique_id: "12345"
    },
    tracingRequestValues: {
      short_id: "12",
      relation_name: "Tracing Request Name",
      inquiry_date: "2020-01-01"
    },
    recordType: "recordType1"
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(TraceMatches, props, fromJS([])));
  });

  it("should render a list with the tracing request information", () => {
    const { tracingRequestValues } = props;
    const expected = [
      "tracing_requests.inquirer",
      `tracing_requests.id: #${tracingRequestValues.short_id}`,
      `tracing_requests.name: ${tracingRequestValues.relation_name}`,
      `tracing_requests.date_of_inquiry: ${tracingRequestValues.inquiry_date}`
    ];

    expect(component.find(ListItemText).map(node => node.text())).to.deep.equal(expected);
  });

  it("should render an IndexTable", () => {
    expect(component.find(IndexTable)).to.have.lengthOf(1);
  });
});
