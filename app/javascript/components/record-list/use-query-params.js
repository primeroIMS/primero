import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";

function useQueryParams() {
  const location = useLocation();
  const queryString = useMemo(() => location.search.replace("?", ""), [location.search]);
  const queryParams = useMemo(() => qs.parse(queryString), [queryString]);

  return { queryParams, queryString };
}

export default useQueryParams;
