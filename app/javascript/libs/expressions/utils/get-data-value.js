import { isImmutable } from "immutable";

export default (key, data) => (isImmutable(data) ? data.get(key) : data[key]);
