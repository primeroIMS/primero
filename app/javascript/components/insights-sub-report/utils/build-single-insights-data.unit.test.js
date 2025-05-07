// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import buildSingleInsightsData from "./build-single-insights-data";

describe("<InsightsSubReport />/utils/buildSingleInsightsData", () => {
  describe("when is not grouped", () => {
    describe("when is single", () => {
      it("when value is array return an array", () => {
        const columns = buildSingleInsightsData(
          fromJS({
            single: {
              violation: {
                boys: 16,
                unknown: 10,
                girls: 12,
                total: 38
              }
            },
            aggregate: {
              perpetrators: [
                {
                  id: "armed_force_2",
                  boys: 1,
                  total: 1
                },
                {
                  id: "armed_force_1",
                  boys: 3,
                  total: 6,
                  girls: 3
                }
              ],
              reporting_location: [
                {
                  id: "IQG08Q02",
                  total: 1,
                  boys: 1
                },
                {
                  id: "IQG17Q05",
                  boys: 1,
                  total: 3,
                  girls: 2
                }
              ]
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
            aggregate: {
              elapsed_reporting_time: [
                {
                  id: "0_3_days",
                  total: 2
                }
              ],
              elapsed_reporting_time_rape: [
                {
                  id: "0_3_days",
                  total: 1
                }
              ]
            },
            single: {
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
            }
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
          aggregate: {
            gbv_sexual_violence_type: []
          },
          single: {
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
          }
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
          aggregate: {
            elapsed_reporting_time: [
              {
                group_id: 2022,
                data: [
                  {
                    id: "0_3_days",
                    total: 2
                  }
                ]
              }
            ],
            elapsed_reporting_time_rape: [
              {
                group_id: 2022,
                data: [
                  {
                    id: "0_3_days",
                    total: 1
                  }
                ]
              }
            ]
          },
          single: {
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
          }
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
