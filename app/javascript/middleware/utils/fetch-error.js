class FetchError extends Error {
  constructor(response, json, ...params) {
    super(...params);

    this.response = response;
    this.json = json;
  }
}

export default FetchError;
