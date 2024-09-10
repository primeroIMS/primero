import { fromJS } from "immutable";

export default (dashboard, keys = []) =>
  fromJS({ indicators: dashboard.get("indicators", fromJS({})).filter((_value, key) => keys.includes(key)) });
