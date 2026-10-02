import reject from "lodash/reject";
import isEmpty from "lodash/isEmpty";

import { QUERY_KEY, TOTAL_KEY } from "../constants";

import getObjectArrayPath from "./get-object-array-path";

export default (totalLabel, object) =>
  reject(
    getObjectArrayPath(totalLabel, object).map(keys =>
      keys.filter(key => ![TOTAL_KEY, totalLabel, QUERY_KEY].includes(key))
    ),
    isEmpty
  );
