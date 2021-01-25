import actionsForKPI from "./actions";
import pathsForKPI from "./paths";

export default identifier => {
  const getKPI = actionsForKPI(identifier);
  const path = pathsForKPI(identifier);

  return dateRange => ({
    type: getKPI,
    KPIidentifier: identifier,
    api: {
      path,
      params: { from: dateRange.from, to: dateRange.to }
    }
  });
};
