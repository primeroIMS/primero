// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import * as utils from "./utils";

describe("<RecordForm>/form/subforms/<TraceComparisonForm> - utils", () => {
  describe("getComparisons", () => {
    const fields = [{ name: "field_1" }, { name: "field_2" }, { name: "field_3" }, { name: "field_4" }];
    const comparedFields = fromJS([
      { field_name: "field_1", case_value: "case_value_1", trace_value: "trace_value_1", match: "mismatch" },
      { field_name: "field_2", case_value: "case_value_2", trace_value: null, match: "mismatch" },
      { field_name: "field_3", case_value: null, trace_value: "trace_value_3", match: "mismatch" }
    ]);

    describe("when does not include empty", () => {
      it("returns only those fields with values for trace and case", () => {
        const expected = [
          {
            field: { name: "field_1" },
            traceValue: "trace_value_1",
            caseValue: "case_value_1",
            match: "mismatch"
          }
        ];

        expect(utils.getComparisons({ fields, comparedFields })).toEqual(expected);
      });
    });

    describe("when includes empty", () => {
      it("returns fields with values for trace or case", () => {
        const expected = [
          {
            field: { name: "field_1" },
            traceValue: "trace_value_1",
            caseValue: "case_value_1",
            match: "mismatch"
          },
          {
            field: { name: "field_2" },
            traceValue: null,
            caseValue: "case_value_2",
            match: "mismatch"
          },
          {
            field: { name: "field_3" },
            traceValue: "trace_value_3",
            caseValue: null,
            match: "mismatch"
          }
        ];

        expect(utils.getComparisons({ fields, comparedFields, includeEmpty: true })).toEqual(expected);
      });
    });
  });

  describe("toAttachmentArray", () => {
    it("returns an array witht the attachment information", () => {
      const expected = [
        { id: "0001", attachment_url: "/audio/1.mp3", file_name: "1.mp3" },
        { id: "0002", attachment_url: "/audio/2.mp3", file_name: "2.mp3" }
      ];

      expect(
        utils.toAttachmentArray(
          fromJS([
            { id: "0001", attachment_url: "/audio/1.mp3", file_name: "1.mp3" },
            { id: "0002", attachment_url: "/audio/2.mp3", file_name: "2.mp3" }
          ])
        )
      ).toEqual(expected);
    });
  });
});
