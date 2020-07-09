import { forKPI as actionsForKPI } from "./actions";
import { forKPI as pathsForKPI } from "./paths";

export const forKPI = identifier => {
  const getKPI = actionsForKPI(identifier);
  const path = pathsForKPI(identifier);

  return dateRange => async dispatch => {
    dispatch({
      type: getKPI,
      KPIidentifier: identifier,
      api: {
        path,
        params: { from: dateRange.from, to: dateRange.to }
      }
    });
  };
};
