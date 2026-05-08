import qs from "qs";
import { isImmutable } from "immutable";

const queryParams = {
  toString: (obj, format = "indices") => qs.stringify(obj, { arrayFormat: format }),
  parse: str => qs.parse(str)
};

function buildPath(path, options, params, external, qsArrayFormat = "indices") {
  const endpoint = external ? path : `${options.baseUrl}/${path}`;
  const urlParams = isImmutable(params) ? params.toJS() : params;

  return `${endpoint}${params ? `?${queryParams.toString(urlParams, qsArrayFormat)}` : ""}`;
}

export default buildPath;
