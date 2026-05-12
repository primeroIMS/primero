import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import qs from "qs";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

function useQueryParams() {
  const location = useLocation();
  const dispatch = useDispatch();
  const queryString = useMemo(() => location.search.replace("?", ""), [location.search]);
  const queryParams = useMemo(() => {
    return qs.parse(queryString);
  }, [queryString]);

  async function search(params) {
    await dispatch(
      push({
        pathname: location.pathname,
        search: `?${qs.stringify(params, { arrayFormat: "brackets" })}`
      })
    );
  }

  return { queryParams, queryString, search };
}

export default useQueryParams;
