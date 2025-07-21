// Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import { ChangeLogsRecord } from "../change-logs/records";

import LoadMoreRecords from "./component";

describe("ChangeLogs - Container", () => {
  const props = {
    selectedForm: "change_logs",
    recordID: "38c82975-99aa-4798-9c3d-dabea104d992",
    recordType: "cases",
    loading: false,
    metadata: fromJS({ page: 1, per: 20, total: 2 }),
    fetchFn: () => {},
    fetchable: true
  };
  const defaultState = fromJS({
    records: {
      changeLogs: {
        data: [
          ChangeLogsRecord({
            record_id: "38c82975-99aa-4798-9c3d-dabea104d992",
            record_type: "cases",
            datetime: "2020-08-10T18:27:33Z",
            user_name: "primero",
            action: "create",
            record_changes: []
          })
        ]
      }
    }
  });

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
