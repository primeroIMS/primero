import qs from "qs";

export const queryParams = {
  toString: obj => qs.stringify(obj),
  parse: str => qs.parse(str)
};

export const buildUrl = (method, path, options = {}) => {
  const baseUrl = new URL("/", window.location.href);
  const url = new URL(`api/${path}`, baseUrl);
  let input = url.href;

  const init = {
    method,
    mode: "same-origin",
    credentials: "same-origin",
    cache: "no-cache",
    redirect: "follow"
  };

  if (method === "POST" || method === "PUT") {
    init.body = JSON.stringify(options.params);
  }

  if (options.params) {
    input += `?${queryParams.toString(options.params)}`;
  }

  return {
    input,
    init
  };
};
