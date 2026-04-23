import qs from "qs";
import { isImmutable } from "immutable";

const queryParams = {
  toString: obj => qs.stringify(obj),
  parse: str => qs.parse(str)
};

function buildPath(path, options, params, external) {
  const endpoint = external ? path : `${options.baseUrl}/${path}`;
  const urlParams = isImmutable(params) ? params.toJS() : params;

  return `${endpoint}${params ? `?${queryParams.toString(urlParams)}` : ""}`;
}

export default buildPath;
