import * as Actions from "./actions";
import * as Paths from "./paths";

export const forKPI = (identifier) => {
  let getKPI = Actions.forKPI(identifier);
  let path = Paths.forKPI(identifier);

  return (dateRange) => async (dispatch) => {
    dispatch({
      type: getKPI,
      KPIidentifier: identifier,
      api: {
        path: path,
        params: { from: dateRange.from, to: dateRange.to }
      }
    })
  };
};
