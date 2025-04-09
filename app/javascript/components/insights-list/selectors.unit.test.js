// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import * as selectors from "./selectors";

describe("<InsightsList /> - Selectors", () => {
  describe("selectInsights", () => {
    const emptyState = fromJS({});
    const reports = [{ id: "report-1" }, { id: "report-2" }];
    const initialState = fromJS({
      records: { insights: { data: reports } }
    });

    it("returns the insights", () => {
      expect(selectors.selectInsights(initialState)).toEqual(fromJS(reports));
    });

    it("returns empty if there is no data", () => {
      expect(selectors.selectInsights(emptyState)).toEqual(fromJS([]));
    });
  });

  describe("selectInsightsPagination", () => {
    const emptyState = fromJS({});
    const metadata = { total: 2 };
    const initialState = fromJS({ records: { insights: { metadata } } });

    it("returns the metadata", () => {
      expect(selectors.selectInsightsPagination(initialState)).toEqual(fromJS(metadata));
    });

    it("returns empty if there is no data", () => {
      expect(selectors.selectInsightsPagination(emptyState)).toEqual(fromJS({}));
    });
  });

  describe("selectLoading", () => {
    const emptyState = fromJS({});
    const initialState = fromJS({
      records: { insights: { loading: true } }
    });

    it("returns true if is loading", () => {
      expect(selectors.selectLoading(initialState)).toBe(true);
    });

    it("returns false if there is no data", () => {
      expect(selectors.selectLoading(emptyState)).toBe(false);
    });
  });
});
