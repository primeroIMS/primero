// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

class FetchError extends Error {
  constructor(response, json, ...params) {
    super(...params);

    this.response = response;
    this.json = json;
  }
}

export default FetchError;
