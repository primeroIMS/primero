// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import { ExportRecord } from "./records";
import reducer from "./reducer";
import actions from "./actions";
import { EXPORT_STATUS } from "./constants";

describe("<ExportList /> - pages/export-list/reducer", () => {
  const defaultState = fromJS({
    data: []
  });

  it("should handle FETCH_EXPORTS_SUCCESS", () => {
    const bulkExport = {
      id: 1,
      status: EXPORT_STATUS.complete,
      started_on: "2020-02-04T20:32:50.078Z",
      file_name: "cases-20200204.325032079.csv",
      export_file: "/rails/active_storage/blobs/cases-20200204.325032079.csv.zip",
      record_type: "case"
    };
    const metadata = {
      total: 40,
      per: 20,
      page: 1
    };

    const payload = {
      data: [bulkExport],
      metadata
    };
    const expected = fromJS({
      data: [ExportRecord(bulkExport)],
      metadata
    });
    const action = {
      type: actions.FETCH_EXPORTS_SUCCESS,
      payload
    };

    const newState = reducer.bulk_exports(defaultState, action);

    expect(newState).toEqual(expected);
  });
});
