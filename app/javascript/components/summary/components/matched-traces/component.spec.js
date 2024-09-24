// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";

import MatchedTraces from "./component";

describe("<MatchedTraces />", () => {
  const props = {
    data: fromJS([{ id: "1234567" }]),
    setSelectedForm: () => {},
    record: fromJS({
      age: 10,
      case_id_display: "1234abcd",
      id: "1234567",
      name: "Test user",
      owned_by: "aa",
      owned_by_agency_id: "aa",
      sex: "aa"
    })
  };

  it("should render 1 <MatchedTracePanel /> component", () => {
    mountedComponent(<MatchedTraces {...props} />);

    expect(screen.getByTestId("matched-trace-panel")).toBeInTheDocument();
  });

  describe("when is new record", () => {
    it("should not render <MatchedTracePanel /> component", () => {
      mountedComponent(<MatchedTraces {...{ ...props, record: {} }} />);

      expect(screen.queryByTestId("matched-trace-panel")).toBeNull();
    });
  });
});
