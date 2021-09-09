import { toServerDateFormat } from "../../libs";

import actionsForKPI from "./actions";
import pathsForKPI from "./paths";

export default identifier => {
  const getKPI = actionsForKPI(identifier);
  const path = pathsForKPI(identifier);

  return dateRange => {
    return {
      type: getKPI,
      KPIidentifier: identifier,
      api: {
        path,
        params: dateRange
          ? {
              from: toServerDateFormat(dateRange.from, { normalize: true }),
              to: toServerDateFormat(dateRange.to, { normalize: true })
            }
          : {}
      }
    };
  };
};
