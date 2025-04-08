// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import getFirstKeyValue from "./get-first-key-value";

describe("<Report /> - utils", () => {
  describe("getFirstKeyValue", () => {
    it("returns the first value of an object", () => {
      expect(
        getFirstKeyValue({
          _total: 1,
          "12 - 17": {
            _total: 1,
            true: {
              _total: 0
            },
            false: {
              _total: 0
            }
          }
        })
      ).toBe(1);
    });

    it("returns the first value of an object after excluding the excludeKey", () => {
      expect(
        getFirstKeyValue(
          {
            _total: 1,
            "12 - 17": {
              _total: 1,
              true: {
                _total: 0
              },
              false: {
                _total: 0
              }
            }
          },
          "_total"
        )
      ).toEqual({
        _total: 1,
        true: {
          _total: 0
        },
        false: {
          _total: 0
        }
      });
    });
  });

  it("when the excludeKey is the only property it is returned", () => {
    expect(
      getFirstKeyValue(
        {
          _total: 1
        },
        "_total"
      )
    ).toEqual({
      _total: 1
    });
  });
});
