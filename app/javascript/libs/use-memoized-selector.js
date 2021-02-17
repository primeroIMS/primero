import { isEqual } from "lodash";
import { useSelector } from "react-redux";

export default selector => {
  return useSelector(selector, isEqual);
};
