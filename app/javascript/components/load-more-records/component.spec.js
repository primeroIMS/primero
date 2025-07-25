// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import LoadMoreRecords from "./component";

describe("LoadMoreRecords - Container", () => {
  beforeEach(() => {
    mountedComponent(
      <LoadMoreRecords
        selectedForm="change_logs"
        recordID="38c82975-99aa-4798-9c3d-dabea104d992"
        recordType="cases"
        loading={false}
        metadata={fromJS({ page: 1, per: 20, total: 2 })}
        fetchFn={() => {}}
        fetchable={false}
      />
    );
  });

  it("renders ActionButton", () => {
    expect(screen.getByText("filters.more")).toBeInTheDocument();
  });
});
