import reject from "lodash/reject";
import isEmpty from "lodash/isEmpty";

import { QUERY_KEY, TOTAL_KEY } from "../constants";

import getObjectArrayPath from "./get-object-array-path";

export default (totalLabel, object) =>
  reject(
    getObjectArrayPath(totalLabel, object).map(
      keys => keys.filter(key => key !== TOTAL_KEY && key !== totalLabel && key !== QUERY_KEY)
    ),
    isEmpty
  );
