// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import buildSingleInsightsData from "./build-single-insights-data";

describe("<InsightsSubReport />/utils/buildSingleInsightsData", () => {
  describe("when is not grouped", () => {
    describe("when is single", () => {
      it("when value is array return an array", () => {
        const columns = buildSingleInsightsData(
          fromJS({
            violation: {
              boys: 16,
              unknown: 10,
              girls: 12,
              total: 38
            }
          }),
          false
        );

        expect(
          columns.equals(
            fromJS([
              { id: "boys", total: 16 },
              { id: "unknown", total: 10 },
              { id: "girls", total: 12 },
              { id: "total", total: 38 }
            ])
          )
        ).toBe(true);
      });
    });

    describe("when is single", () => {
      it("returns a single object with items", () => {
        const columns = buildSingleInsightsData(
          fromJS({
            total: [
              {
                id: "incidents",
                total: 17
              }
            ],
            gbv_sexual_violence: [
              {
                id: "gbv_sexual_violence_type",
                total: 2
              }
            ]
          }),
          false
        );

        expect(
          columns.equals(
            fromJS([
              { id: "total", total: 17 },
              { id: "gbv_sexual_violence", total: 2 }
            ])
          )
        ).toBe(true);
      });
    });
  });

  describe("when is grouped by year", () => {
    it("returns a single object with items", () => {
      const columns = buildSingleInsightsData(
        fromJS({
          total: [
            {
              group_id: "april-2022",
              data: [
                {
                  id: "incidents",
                  total: 1
                }
              ]
            }
          ],
          gbv_sexual_violence: []
        }),
        true
      );

      expect(columns).toEqual(
        fromJS([
          {
            group_id: "april-2022",
            data: [
              {
                id: "total",
                total: 1
              },
              {
                id: "gbv_sexual_violence",
                total: 0
              }
            ]
          }
        ])
      );
    });
  });

  describe("when is grouped by year", () => {
    it("returns a single object with items", () => {
      const columns = buildSingleInsightsData(
        fromJS({
          total: [
            {
              group_id: 2022,
              data: [
                {
                  id: "incidents",
                  total: 16
                }
              ]
            }
          ],
          gbv_sexual_violence: [
            {
              group_id: 2022,
              data: [
                {
                  id: "gbv_sexual_violence_type",
                  total: 2
                }
              ]
            }
          ],
          gbv_previous_incidents: [
            {
              group_id: 2022,
              data: [
                {
                  id: "gbv_previous_incidents",
                  total: 1
                }
              ]
            }
          ]
        }),
        true
      );

      expect(columns).toEqual(
        fromJS([
          {
            group_id: 2022,
            data: [
              {
                id: "total",
                total: 16
              },
              {
                id: "gbv_sexual_violence",
                total: 2
              },
              {
                id: "gbv_previous_incidents",
                total: 1
              }
            ]
          }
        ])
      );
    });
  });
});
