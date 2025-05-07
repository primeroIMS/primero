// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import validateMetadata from "./validate-metadata";

describe("pages/admin/utils/validateMetadata", () => {
  it("should return metadata with defaultMetadata values for per and page", () => {
    const defaultMetadata = {
      per: 1,
      page: 20
    };

    const expected = fromJS({
      per: 1,
      page: 20
    });

    expect(validateMetadata(fromJS({ per: null, page: null }), defaultMetadata)).toEqual(expected);
  });

  it("should return metadata if per and page values are not null", () => {
    const metadata = fromJS({ per: 1, page: 100 });
    const defaultMetadata = {
      per: 1,
      page: 20
    };

    const expected = fromJS({
      per: 1,
      page: 100
    });

    expect(validateMetadata(metadata, defaultMetadata)).toEqual(expected);
  });
});
