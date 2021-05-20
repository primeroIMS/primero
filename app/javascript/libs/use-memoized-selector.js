import { isEqual } from "lodash";
import { useSelector } from "react-redux";

export default (selector, equalityFn = isEqual) => {
  return useSelector(selector, equalityFn);
};
