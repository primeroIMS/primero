function mockFetchSuccess({ url = "/", status = 200, json }) {
  global.fetch.mockResolvedValueOnce({
    url,
    ok: status < 400,
    status,
    json: jest.fn().mockResolvedValueOnce(json)
  });
}

function mockFetchError({ url = "/", status = 200, json }) {
  global.fetch.mockRejectedValueOnce({
    url,
    ok: false,
    status,
    json: jest.fn().mockResolvedValueOnce(json)
  });
}

export { mockFetchSuccess, mockFetchError };
