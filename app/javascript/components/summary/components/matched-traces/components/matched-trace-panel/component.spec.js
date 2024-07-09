// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../../test-utils";

import MatchedTracePanel from "./component";

describe("<MatchedTracePanel />", () => {
  const props = { css: {}, matchedTrace: fromJS({ id: "123457" }) };

  it("should render 1 <Accordion /> component", () => {
    mountedComponent(<MatchedTracePanel {...props} />);

    expect(screen.getByTestId("matched-trace-panel")).toBeInTheDocument();
  });

  it("should render 1 <AccordionSummary /> component", () => {
    mountedComponent(<MatchedTracePanel {...props} />);

    expect(screen.getByTestId("matched-trace-panel-summary")).toBeInTheDocument();
  });

  it("should render 1 <ActionButton /> component", () => {
    mountedComponent(<MatchedTracePanel {...props} />);

    expect(screen.getByTestId("action-button")).toBeInTheDocument();
  });
});
