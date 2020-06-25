import { forKPI as Actions_forKPI } from "./actions";
import { forKPI as Paths_forKPI } from "./paths";

export const forKPI = identifier => {
  const getKPI = Actions_forKPI(identifier);
  const path = Paths_forKPI(identifier);

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
